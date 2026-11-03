variable "name" { type = string }
variable "vpc_id" { type = string }
variable "allowed_http_cidrs" { type = list(string) }
variable "secret_arns" { type = list(string) }

resource "aws_security_group" "node" {
  name_prefix = "${var.name}-node-"
  description = "Web traffic only. No SSH."
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP to the ingress controller"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.allowed_http_cidrs
  }
  egress {
    description = "Outbound for image pulls, package installs and SSM"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  lifecycle { create_before_destroy = true }
}

data "aws_iam_policy_document" "assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}
resource "aws_iam_role" "node" {
  name               = "${var.name}-node"
  assume_role_policy = data.aws_iam_policy_document.assume.json
}
resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
data "aws_iam_policy_document" "secrets" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = var.secret_arns
  }
}
resource "aws_iam_role_policy" "secrets" {
  name   = "read-app-secrets"
  role   = aws_iam_role.node.id
  policy = data.aws_iam_policy_document.secrets.json
}
resource "aws_iam_instance_profile" "node" {
  name = "${var.name}-node"
  role = aws_iam_role.node.name
}

output "security_group_id" { value = aws_security_group.node.id }
output "instance_profile_name" { value = aws_iam_instance_profile.node.name }
