region              = "us-east-1"
env                 = "prod"
vpc_cidr            = "10.20.0.0/16"
public_subnet_cidr  = "10.20.1.0/24"
private_subnet_cidr = "10.20.2.0/24"
instance_type       = "t3.small"
allowed_http_cidrs  = ["0.0.0.0/0"]
