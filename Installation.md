## Client

Install the latest stable release of the T4 Python library with `pip`:

```bash
pip install t4
```

Note that `t4` requires Python 3.6 or higher.


## Catalog
The Quilt T4 catalog is based on top of S3. We use [AWS CloudFormation](https://aws.amazon.com/cloudformation/) to provision the service.

The following instructions use CloudFormation to install T4 on a bucket in your AWS account.

1. Log in to your AWS console

1. Go to Services > CloudFormation > Create stack

<img src="../deployment/img/start.png" width="400" />
  
1. Click "Upload a template to Amazon S3" and select `t4.yaml`, provided to
you by Quilt
1. Click Next
1. Fill in Stack name and Parameters.
    <br/>
    <br/>

    ![](../deployment/img/params.png)

> Carefully note parameter descriptions to avoid stack failure
1. Click Next
1. You can safely skip the Options screen (below) by clicking Next
    <br/>
    <br/>

    ![](../deployment/img/skip.png)

1. Acknowledge that CloudFormation may create IAM roles
    <br/>
    <br/>

    ![](../deployment/img/finish.png)

1. Click Create (typically takes 30 minutes to complete)

1. You should see `CREATE_COMPLETE` as the Status for your CloudFormation stack.
Select the stack and open the Outputs tab. The Value of `CloudFrontDomain`
is your CloudFront origin. Depending on your S3 bucket's [CORS policy](#pre-requisites)
your web catalog is available at the CloudFront and/or the `CNAME` set
by you in the following step.
    <br/>
    <br/>

    ![](../deployment/img/outputs.png)

1. If desired, set a `CNAME` record with your DNS service that points to your CloudFrontDomain. The `CNAME` must also be present in your [CORS policy](#pre-requisites). Now users can access the T4 catalog at your custom
`CNAME`.
