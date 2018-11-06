PHONY: aws-assets aws-htmljs aws-cache

aws-assets:
	aws s3 sync . s3://pudding.cool/2018/11/titletowns --delete --cache-control 'max-age=31536000' --exclude 'index.html' --exclude 'Makefile'

aws-htmljs:
	aws s3 cp ./index.html s3://pudding.cool/2018/11/titletowns/index.html

aws-cache:
	aws cloudfront create-invalidation --distribution-id E13X38CRR4E04D --paths '/2018/11/titletowns*'	

pudding: aws-assets aws-htmljs aws-cache
