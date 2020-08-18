terraform {
  backend "s3" {
    bucket = "sh.csarko.terraform"
    key = "webgl.csarko.sh/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = "us-east-1"
}

locals {
  domain_name = "webgl.csarko.sh"
}

data "aws_acm_certificate" "cert" {
  domain = "csarko.sh"
}

data "aws_route53_zone" "zone" {
  name = "csarko.sh."
}

resource "aws_route53_record" "dns_record" {
  name = "${local.domain_name}."
  type = "A"
  zone_id = data.aws_route53_zone.zone.zone_id
  alias {
    evaluate_target_health = true
    name = aws_cloudfront_distribution.cdn.domain_name
    zone_id = aws_cloudfront_distribution.cdn.hosted_zone_id
  }
}

resource "aws_s3_bucket" "webbucket" {
  bucket = local.domain_name
  acl = "public-read"
  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = [
      "https://csarko.sh",
      "https://*.csarko.sh"
    ]
  }
  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[{
    "Sid":"PublicReadGetObject",
    "Effect":"Allow",
    "Principal": "*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::${local.domain_name}/*"]
  }]
}
  POLICY
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_cloudfront_distribution" "cdn" {
  aliases = [local.domain_name]
  enabled = true
  default_root_object = "index.html"
  custom_error_response {
    response_page_path = "/index.html"
    error_code = 404
    response_code = 200
  }
  origin {
    domain_name = aws_s3_bucket.webbucket.bucket_regional_domain_name
    origin_id = aws_s3_bucket.webbucket.id
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.cert.arn
    ssl_support_method = "sni-only"
  }
  ordered_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    forwarded_values {
      cookies {
        forward = "none"
      }
      query_string = false
    }
    min_ttl = 31536000
    default_ttl = 31536000
    max_ttl = 31536000
    path_pattern = "/static/*"
    target_origin_id = aws_s3_bucket.webbucket.id
    viewer_protocol_policy = "redirect-to-https"
  }
  ordered_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    forwarded_values {
      cookies {
        forward = "none"
      }
      query_string = false
    }
    min_ttl = 0
    default_ttl = 0
    max_ttl = 0
    path_pattern = "/"
    target_origin_id = aws_s3_bucket.webbucket.id
    viewer_protocol_policy = "redirect-to-https"
  }
  default_cache_behavior {
    allowed_methods = ["HEAD", "GET"]
    cached_methods = ["HEAD", "GET"]
    forwarded_values {
      cookies {
        forward = "none"
      }
      query_string = false
    }
    target_origin_id = aws_s3_bucket.webbucket.id
    viewer_protocol_policy = "redirect-to-https"
  }
}
