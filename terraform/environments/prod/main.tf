provider "aws" {
  region = var.region
  default_tags {
    tags = { Project = "zuri-market", Env = var.env, ManagedBy = "terraform" }
  }
}

module "network" {
  source              = "../../modules/network"
  name                = "zuri-${var.env}"
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidr  = var.public_subnet_cidr
  private_subnet_cidr = var.private_subnet_cidr
  az                  = "${var.region}a"
}
module "secrets" {
  source = "../../modules/secrets"
  env    = var.env
}
module "security" {
  source             = "../../modules/security"
  name               = "zuri-${var.env}"
  vpc_id             = module.network.vpc_id
  allowed_http_cidrs = var.allowed_http_cidrs
  secret_arns        = module.secrets.secret_arns
}
module "compute" {
  source            = "../../modules/compute"
  name              = "zuri-${var.env}"
  instance_type     = var.instance_type
  subnet_id         = module.network.public_subnet_id
  security_group_id = module.security.security_group_id
  instance_profile  = module.security.instance_profile_name
  region            = var.region
}
