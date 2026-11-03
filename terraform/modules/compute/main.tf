variable "name" { type = string }
variable "instance_type" { type = string }
variable "subnet_id" { type = string }
variable "security_group_id" { type = string }
variable "instance_profile" { type = string }
variable "region" { type = string }

data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_instance" "node" {
  ami                         = data.aws_ssm_parameter.al2023.value
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [var.security_group_id]
  iam_instance_profile        = var.instance_profile
  associate_public_ip_address = true
  user_data                   = templatefile("${path.module}/user_data.sh.tftpl", { region = var.region })

  metadata_options {
    http_tokens                 = "required" # IMDSv2 only
    http_put_response_hop_limit = 2
  }
  root_block_device {
    volume_size = 30
    volume_type = "gp3"
    encrypted   = true
  }
  tags = { Name = "${var.name}-node" }
}

output "instance_id" { value = aws_instance.node.id }
output "public_ip" { value = aws_instance.node.public_ip }
