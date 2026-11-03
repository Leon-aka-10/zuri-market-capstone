terraform {
  required_version = ">= 1.11"
  required_providers { aws = { source = "hashicorp/aws", version = "~> 6.0" } }
  backend "s3" {
    bucket       = "leon-aka-10-zuri-tfstate-5849"
    key          = "prod/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true # S3 native locking, no DynamoDB table needed
  }
}
