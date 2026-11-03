variable "region" { type = string }
variable "env" { type = string }
variable "vpc_cidr" { type = string }
variable "public_subnet_cidr" { type = string }
variable "private_subnet_cidr" { type = string }
variable "instance_type" { type = string }
variable "allowed_http_cidrs" { type = list(string) }
