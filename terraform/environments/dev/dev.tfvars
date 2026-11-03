region              = "us-east-1"
env                 = "dev"
vpc_cidr            = "10.10.0.0/16"
public_subnet_cidr  = "10.10.1.0/24"
private_subnet_cidr = "10.10.2.0/24"
instance_type       = "t3.medium"
allowed_http_cidrs  = ["0.0.0.0/0"]
