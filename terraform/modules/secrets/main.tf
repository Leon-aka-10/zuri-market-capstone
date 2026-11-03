variable "env" { type = string }

# Creates the secret container only. The VALUE is set with the AWS CLI so it never enters
# Terraform state or Git.
resource "aws_secretsmanager_secret" "backend" {
  name                    = "zuri/${var.env}/backend"
  recovery_window_in_days = 0 # lets you destroy and recreate during the capstone
}

output "secret_arns" { value = [aws_secretsmanager_secret.backend.arn] }
