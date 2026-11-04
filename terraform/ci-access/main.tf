provider "aws" {
  region = var.region
  default_tags {
    tags = { Project = "zuri-market", ManagedBy = "terraform", Stack = "ci-access" }
  }
}

variable "region" { type = string }
variable "repo" { type = string } # exact case, e.g. Leon-aka-10/zuri-market-capstone
variable "create_oidc_provider" { type = bool }

data "aws_caller_identity" "me" {}

resource "aws_iam_openid_connect_provider" "github" {
  count          = var.create_oidc_provider ? 1 : 0
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

data "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}

locals {
  oidc_arn = var.create_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github[0].arn
  acct     = data.aws_caller_identity.me.account_id
}

# Only this repo's main branch can assume the roles. Pull-request runs cannot.
data "aws_iam_policy_document" "trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [local.oidc_arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.repo}:ref:refs/heads/main"]
    }
  }
}

# ---- infra role: runs terraform ------------------------------------------
resource "aws_iam_role" "infra" {
  name               = "gha-zuri-infra"
  assume_role_policy = data.aws_iam_policy_document.trust.json
}

resource "aws_iam_role_policy_attachment" "infra_power" {
  role       = aws_iam_role.infra.name
  policy_arn = "arn:aws:iam::aws:policy/PowerUserAccess"
}

# PowerUserAccess has no IAM, so allow IAM only for zuri-* roles and profiles.
data "aws_iam_policy_document" "infra_iam" {
  statement {
    actions = [
      "iam:CreateRole", "iam:DeleteRole", "iam:GetRole", "iam:UpdateRole",
      "iam:UpdateAssumeRolePolicy", "iam:TagRole", "iam:UntagRole", "iam:PassRole",
      "iam:AttachRolePolicy", "iam:DetachRolePolicy", "iam:PutRolePolicy",
      "iam:DeleteRolePolicy", "iam:GetRolePolicy", "iam:ListRolePolicies",
      "iam:ListAttachedRolePolicies", "iam:ListInstanceProfilesForRole",
      "iam:CreateInstanceProfile", "iam:DeleteInstanceProfile", "iam:GetInstanceProfile",
      "iam:AddRoleToInstanceProfile", "iam:RemoveRoleFromInstanceProfile",
      "iam:TagInstanceProfile", "iam:UntagInstanceProfile",
    ]
    resources = [
      "arn:aws:iam::${local.acct}:role/zuri-*",
      "arn:aws:iam::${local.acct}:instance-profile/zuri-*",
    ]
  }
}

resource "aws_iam_role_policy" "infra_iam" {
  name   = "manage-zuri-iam"
  role   = aws_iam_role.infra.id
  policy = data.aws_iam_policy_document.infra_iam.json
}

# ---- deploy role: can only run a command on the dev node ------------------
resource "aws_iam_role" "deploy" {
  name               = "gha-zuri-deploy"
  assume_role_policy = data.aws_iam_policy_document.trust.json
}

data "aws_iam_policy_document" "deploy" {
  statement {
    actions   = ["ssm:SendCommand"]
    resources = ["arn:aws:ssm:${var.region}::document/AWS-RunShellScript"]
  }
  statement {
    actions   = ["ssm:SendCommand"]
    resources = ["arn:aws:ec2:${var.region}:${local.acct}:instance/*"]
    condition {
      test     = "StringEquals"
      variable = "ssm:resourceTag/Env"
      values   = ["dev"]
    }
  }
  statement {
    actions   = ["ssm:GetCommandInvocation", "ssm:ListCommandInvocations", "ssm:DescribeInstanceInformation"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "run-deploy-on-dev-node"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}

output "infra_role_arn" { value = aws_iam_role.infra.arn }
output "deploy_role_arn" { value = aws_iam_role.deploy.arn }
