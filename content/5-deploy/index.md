---
emoji: 🚀
title: 'FE 정적 배포 경험'
date: '2025-03-19'
categories: featured-Dev
---

[syncspot](https://syncspot.kr/) 서비스를 개발하면서 AWS의 S3+CloudFront+Route53을 사용하여 프론트엔드 배포를 진행해주었다.

netlify나 vercel을 통한 배포도 가능하지만, 이번 기회에 전체적인 배포 프로세스가 어떻게 이루어지는 지 알아보고 싶기도 했고, Devops에 대한 지식도 쌓을 겸 공부도 하면서 배포를 해보았다.

> 왜 EC2가 아닌 S3 + CloudFront + Route53를 선택했을까?

우리가 만들고 있는 [syncspot](https://syncspot.kr/) 프로젝트의 경우, React로 만든 **CSR** 프로젝트 이다.

React 애플리케이션의 경우 빌드 과정에서 정적 파일(HTML, CSS, JS)로 변환되며, 이러한 정적 파일 배포에는 EC2와 같은 동적 서버보다 S3 + CloudFront + Route 53 조합이 더 적합하다고 판단했다.

그 이유는 S3는 정적 파일을 저렴하고 안정적으로 저장 및 제공할 수 있으며, CloudFront는 글로벌 CDN을 통해 사용자에게 빠르고 안정적인 콘텐츠 전달을 보장한다는 특징이 있기 때문이다. 특히, CloudFront는 엣지 서버 캐싱과 HTTPS를 기본 제공하여 성능과 보안을 강화할 수 있고, Route 53을 활용하면 사용자 정의 도메인과 SSL 인증서를 간단히 설정할 수 있어 프로덕션 환경에서 최적화된 배포가 가능하다고 판단했다.

반면, EC2는 서버 설정, 관리, 확장 등 추가적인 운영 부담이 발생하며, 비용도 상대적으로 높다는 특징이 있다. 따라서 정적 콘텐츠 기반인 React 애플리케이션 배포에서는 서버리스 아키텍처의 이점(비용 효율성, 관리 용이성, 확장성)을 극대화할 수 있는 S3 + CloudFront + Route 53이 가장 적합한 선택이라고 판단했다.

## 🎯 배포에 들어가기 앞서…

배포에 들어가기에 앞서 아래 배포과정에서 사용되는 용어 및 개념들에 대해 간단하게만 정리해보자.

### ✅ IAM

`Identity and Access Management`의 약자로 AWS 리소스에 대한 엑세스를 안전하게 제어할 수 있는 웹 서비스이다. 또한 리소스를 사용하도록 **인증 및 권한 부여된 대상을 제어**하는 역할을 한다.

### ✅ S3

**Simple Storage Service(S3)**는 확장성, 데이터 가용성, 보안 및 성능을 제공하는 객체 스토리지 서비스로 저장하고자 하는 데이터를 버킷 내의 객체로 저장한다.

### ✅ CloudFront

.html, .css, .js 및 이미지 파일과 같은 정적 및 동적 웹 콘텐츠를 사용자에게 더 빨리 배포하도록 지원하는 웹 서비스이다. **캐싱**을 통해 사용자에게 더 빠른 전송 속도를 제공한다는 특징이 있으며, 손쉽게 **http 요청을 https로 리다이렉션** 가능하다.

### ✅ Load Balance

콘텐츠 전송 요청을 받았을 때 **최적의 네트워크 환경**을 찾아 연결하는 기술로 **물리적으로 가장 가까운 곳**으로 접속을 유도한다.

### ✅ Route 53

**도메인 등록, DNS 라우팅, 상태 확인** 등을 실행할 수 있는 Domain Name System (DNS) 웹 서비스이다.

## 🎯 도메인 구입 (feat. 가비아)

이제 본격적으로 배포과정을 진행해보자. 나의 경우 배포에 앞서 [가비아](https://www.gabia.com/) 사이트를 통해 도메인을 구입해주었다.

[가비아](https://www.gabia.com/) 사이트를 사용한다면, 우측 상단의 My가비아를 통해 아래의 사진과 같이 현재 내 도메인을 확인할 수 있으며,

![](https://velog.velcdn.com/images/cllaude/post/3ac3270f-4430-4e91-80b4-04eaf762ad3e/image.png)

도메인을 클릭할 경우 아래와 같이 내 도메인에 대한 관리가 가능하다.

![](https://velog.velcdn.com/images/cllaude/post/c0017303-e2ae-444e-ac95-c31f6ba67c9b/image.png)

관리를 클릭할 경우 아래와 같이 소유자, 관리자 및 네임서버의 정보들을 확인할 수 있다.

![](https://velog.velcdn.com/images/cllaude/post/05b2973d-0105-4cfb-835c-74e73ea0bc69/image.png)

## 🎯 IAM 계정 생성 및 설정

먼저 IAM 계정 생성 및 설정과정이 필요하다.

![](https://velog.velcdn.com/images/cllaude/post/b37b7ee9-cba8-4331-a553-e1cea90a4320/image.png)

AWS에 IAM을 검색하고 사용자 생성을 클릭한다.

![](https://velog.velcdn.com/images/cllaude/post/02f475c5-5afa-4c2e-ab72-bbb837f601e3/image.png)

사용자 이름을 적고 AWS Management Console에 대한 엑세스 권한 제공을 체크해준 후, IAM 사용자를 생성하고 싶음 선택하고 다음으로 넘어간다.

![](https://velog.velcdn.com/images/cllaude/post/1769fcb1-6970-46fd-adb9-0f04d278cdb3/image.png)

권한 옵션을 **직접 정책 연결** 로 바꾸어 **AmazonS3FullAccess**, **CloudFrontFullAccess**를 추가한다.

이후 사용자 생성 버튼을 클릭해 사용자를 생성하고, .csv파일을 다운받아저장해 둔다.

> 사용자가 잘 생성되었는지 확인해보기 위해 IAM검색 -> 좌측메뉴에서 액세스관리 안에있는 사용자를 클릭하여 확인해보면, 방금 만든 사용자의 이름에 해당하는 사용자가 생성된것을 확인할 수 있다.

> 위에서 만들어준 사용자 이름에 해당하는 값을 클릭해 해당 계정으로 들어가서, 아래와 같이 화면 중간쯤에 있는 메뉴중 보안 자격 증명 메뉴를 클릭하자.

![](https://velog.velcdn.com/images/cllaude/post/7ec817ad-1599-42a7-95ed-5a70baf0174b/image.png)

그 후 스크롤을 아래로 조금만 내리다 보면, 아래와 같이 **액세스 키 만들기** 가 있다. 이를 클릭해주자.

![](https://velog.velcdn.com/images/cllaude/post/6542a11b-4ccb-4040-b49d-4ada261b1f38/image.png)

클릭후에는 아래와 같은 화면이 보일텐데, CLI를 선택하고, 확인 체크 박스를 체크해주고 다음으로 넘어가자.

![](https://velog.velcdn.com/images/cllaude/post/220fd774-6f09-44df-9073-3de132424e02/image.png)

넘어가면 아래의 화면이 나올텐데 여기서 액세스 키 만들기 버튼 클릭하여 액세스 키를 만들어주자.

![](https://velog.velcdn.com/images/cllaude/post/c70b2826-ac3d-4d04-b2d1-34d33d07fc11/image.png)

> 최종적으로 액세스 키를 만들었다면 .csv파일이 나온다. 이 파일을 다운로드 받아 안전한 곳에 보관하고, 화면에 나오는 **액세스키**와 **비밀 엑세스 키** 값을 기록하자.

## 🎯 S3 버킷 생성

다음으로 S3 버킷 생성을 진행하자. 그 전에 CloudFront 를 통해 S3 에 HTTPS 를 설정하려면 인증서가 필요한데 이 인증서가 Region 이 미국 북부(버지니아) 인 사용자만 사용할 수 있으므로, 우측 상단의 리전을 버지니아 북부로 바꿔주자 (us-east-1)

![](https://velog.velcdn.com/images/cllaude/post/79366db4-5f3c-4640-bdda-d10874d3e618/image.png)

그 후 버킷 만들기를 클릭하여, 구입한 도메인과 동일한 이름의 버킷을 만들어 준다. (예. 버킷이름을 syncspot으로 한다)

![](https://velog.velcdn.com/images/cllaude/post/81d53c37-7569-4554-81b0-fb1193a419cc/image.png)

그 다음으로 아래와 같이 ACL 활성화를 선택해주고, 퍼블릭 엑세스 차단 설정은 해제해준 후, 주의사항의 현재 설정으로 인해 ~~ 부분을 체크하고 하단의 버킷 만들기를 클릭한다.

![](https://velog.velcdn.com/images/cllaude/post/861250b9-4594-457a-9ef5-f613a2e82c5b/image.png)

이렇게 버킷을 만들어 주었다면 방금 만든 버킷을 클릭하여, 속성탭으로 들어가, 맨 하단에 있는 정적 웹사이트 호스팅에서 편집을 클릭한다.

![](https://velog.velcdn.com/images/cllaude/post/777ff000-7a89-4803-abe8-842e4a9835ab/image.png)

그 다음 아래와 같이 정적 웹 사이트 호스팅을 활성화로 바꿔주고, 인덱스 문서와 오류 문서를 index.html로 설정해주고 변경사항을 저장한다.

![](https://velog.velcdn.com/images/cllaude/post/51d000d0-7fe7-4c38-99e5-e22d5f7f527f/image.png)

그 다음으로는 권한탭으로 들어간다. 그 후 **버킷 정책**과 **CORS**를 아래와 같이 설정한다.

> **버킷 정책**은 아래를 붙여 넣는다 (이때, 아래의 BUCKET_NAME에는 위에서 만든 버킷의 이름을 넣어주면 된다. 나의 경우 위에서 syncspot이라는 이름으로 버킷을 만들었으므로 `arn:aws:s3:::syncspot/*` 으로 적어주었다.)

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::BUCKET_NAME/*"
        }
    ]
}
```

> CORS의 경우에는 편집하기 버튼을 클릭하고 아래의 내용을 넣어준다.

```
[
    {
        "AllowedOrigins": [ "*" ],
        "AllowedMethods": [ "GET", "PUT", "POST", "HEAD" ],
        "AllowedHeaders": [ "*" ],
        "ExposeHeaders": [ "x-amz-server-side-encryption", "x-amz-request-id", "x-amz-id-2" ],
        "MaxAgeSeconds": 3000
    }
]
```

마지막으로 build파일을 만들어 업로드 하면 된다.
먼저 객체 탭으로 간 후 우측에 업로드 버튼을 클릭한다. 그 후 `npm run build` 또는 `yarn build` 결과로 나온 빌드 파일을 드래그 해서 업로드 하자. 나의 경우 vite를 사용하고 패키지 매니저로 yarn을 사용하고 있기에 yarn build를 통해 나온 dist폴더 내에 있는 폴더 및 파일을 드래그 해주었다.(이때 dist폴더 내에 있는 것들을 드래그 해주면 된다. 예를 들어 dist폴더내에 a폴더, b폴더, c파일, d파일이 있다면, a,b,c,d를 드래그하면 된다. 즉, a폴더내에 있는것 하나하나 드래그 하는 것이 아님)

![](https://velog.velcdn.com/images/cllaude/post/9f8e7093-d077-457a-8ffd-9042590e2ef5/image.png)

업로드를 진행하고 속성 탭을 클릭하고, 아래로 스크롤을 내려 정적 웹 사이트 호스팅 부분으로가서 버킷 웹 사이트 엔드포인트에 있는 주소를 클릭해보면 프로젝트가 배포된 것을 볼 수 있다. (amazonaws.com으로 끝나는 url을 클릭하면된다)

## 🎯 Route53

다음으로 Route53으로 가서 호스팅 영역을 등록해야 한다.

Route53을 검색하면 아래와 같이 나올텐데, 아래의 Route53 대시보드에서 DNS 관리 부분의 호스팅 영역을 클릭하자. (아래의 사진으로 보면 2를 클릭하는 것)
![](https://velog.velcdn.com/images/cllaude/post/4d29180d-b95c-454f-9f52-0c9661d20f0a/image.png)

그 후 아래의 호스팅 영역 생성 버튼을 누르자.

![](https://velog.velcdn.com/images/cllaude/post/6972d2a6-39e1-41f6-be64-4787f20f3b36/image.png)

도메인 이름에는 앞서 구입해준 도메인 (syncspot.kr)을 적고, 우측 하단의 호스팅 영역 생성 버튼을 클릭해주자.

![](https://velog.velcdn.com/images/cllaude/post/5cf80014-c7fa-44c4-965c-57aa00edabd9/image.png)

그렇다면 아래와 같이 나올텐데, 아래의 NS 부분의 4개의 값을 가비아의 네임서버와 연결시켜주자.

![](https://velog.velcdn.com/images/cllaude/post/6e360892-2d07-4733-9a2a-2544ed6018eb/image.png)

가비아에서 My가비아 -> 도메인 -> 원하는 도메인의 관리 -> 네임 서버 설정 클릭을 하고, 4개의 값을 넣어주자. (나의 경우 1~3차가 이미 채워져있었기 때문에 추가버튼을 눌러주고 Route53에 있는 값 4개를 넣어주었음 + 이때 Route53의 4개의 NS값 맨뒤에 .은 생략하고 복사해서 가비아에 설정해주자.)

![](https://velog.velcdn.com/images/cllaude/post/2e170fb4-d421-40f2-8a79-4fb56fc2bb61/image.png)

여기까지 했다면, 다음으로 Certificate Manager를 검색해서 SSL 인증서 설정 과정을 진행하자. 검색에 Certificate Manager를 검색하면 아래의 화면이 나온다. 그렇다면 우측상단의 요청 버튼을 클릭하자.

![](https://velog.velcdn.com/images/cllaude/post/010be1ca-6c73-4dd3-8b77-999550dd8cf9/image.png)

> 아래에서 다음 클릭

![](https://velog.velcdn.com/images/cllaude/post/415523cf-94b2-44bd-8ee9-509b4e21836b/image.png)

다음을 클릭했다면 아래의 화면이 나올텐데 여기서 도메인 이름에 우리가 구입한 도메인 이름을 넣어주자. 나의 경우 해당 부분에 **syncspot.kr**를 입력해주었으며 추가로 `이 인증서에 다른 이름 추가` 버튼을 클릭하여 **www.syncspot.kr**도 넣어주었다.

![](https://velog.velcdn.com/images/cllaude/post/538d86f6-cdd2-4bea-98b4-b602756a7e54/image.png)

그 다음으로 요청 버튼을 클릭하면 아래의 화면이 나온다. (인증서 발급의 경우 약 5분 정도 소요되었다. 아래의 사진처럼 상태가 성공이 아니라 대기중이라면 약 5분 정도 기다리면 될 것)

![](https://velog.velcdn.com/images/cllaude/post/d2613caf-53b0-4eb2-9a64-57077d685bf0/image.png)

여기서 `Route 53에서 레코드 생성` 버튼을 클릭하자.

그 후, Route53에 돌아와 앞서 만들어 주었던 호스팅 영역을 클릭해 확인해보면, CNAME 유형의 라인이 2개 생긴 것을 알 수 있다. 해당 레코드 이름과 값/트래픽 라우팅 대상 값이 이전 인증서의 값과 같은지 확인하자!

## 🎯 CloudFront

이제 CloudFront 세팅을 진행해주자.

CloudFront를 검색하면 아래의 화면과 같이 나오는데 여기서 배포 생성 버튼을 클릭하자.

![](https://velog.velcdn.com/images/cllaude/post/d9cd8443-26ff-4e53-8cfc-0aaee09f0453/image.png)

그 후 아래와 같이 Origin domain을 누르고 앞서 만들었던 이름의 s3-website를 선택한다. 나의 경우 syncspot으로 만들었기에 이를 선택하였다.

![](https://velog.velcdn.com/images/cllaude/post/17a6b090-426d-44ff-ab35-171adbcc92aa/image.png)

그 후 웹 사이트 `엔드포인트 사용` 을 클릭하고 아래와 같이 설정한다.

![](https://velog.velcdn.com/images/cllaude/post/42e8c5fa-068c-4b1a-8198-08be90358c0b/image.png)

다음으로는 아래의 화면들을 참고해서 설정한다.

![](https://velog.velcdn.com/images/cllaude/post/31ad4e92-b63d-44b3-8186-70b1378fb7ee/image.png)

![](https://velog.velcdn.com/images/cllaude/post/a7ee987d-2e69-49ff-8bb0-9dab59ca4d52/image.png)

![](https://velog.velcdn.com/images/cllaude/post/a2d4de24-10ea-45f4-a5a0-3d0aaade18de/image.png)

![](https://velog.velcdn.com/images/cllaude/post/39f2cd69-e33e-46d3-b478-4b9ab56d1696/image.png)

여기서 아래의 부분을 조금 신경써주자.

![](https://velog.velcdn.com/images/cllaude/post/d175ccb3-f9d4-4a17-8214-922fb1cfeaa6/image.png)

대체 도메인 이름(CNAME) - 선택 사항 부분에서 `항목 추가` 를 클릭하고, 앞서 구입한 도메인을 입력해주자. (나의 경우 syncspot.kr을 입력해주었다. 그리고 `항목 추가` 버튼을 한번 더 눌러 www.syncspot.kr도 추가해주었다.)

그 후 Custom SSL Certificate 부분에서는 앞서 ACM에서 발급받은 인증서을 선택해주자.

![](https://velog.velcdn.com/images/cllaude/post/d409f756-c905-425d-93c7-48f16ff1eba4/image.png)

최종적으로 아래와 같이 설정하고 배포 생성 버튼을 누르자. (기본값 루트 객체 - 선택사항 부분에 index.html을 입력)

![](https://velog.velcdn.com/images/cllaude/post/80d1c840-5fad-4807-830c-3d59660a22e2/image.png)

그 후 배포된 CloudFront로 들어가면 아래와 같은 화면이 보이는데 여기서 배포 도메인 이름 부분을 클릭하면 배포된 도메인 주소 (https 적용된 주소)로 들어가질 것이다.

![](https://velog.velcdn.com/images/cllaude/post/f4a71c15-1fc3-46d9-8aa6-c13916e43752/image.png)

그 후, 캐시 무효화 탭으로 들어가서 아래와 같이 무효화를 설정해주자.

![](https://velog.velcdn.com/images/cllaude/post/41c32805-afb5-47cc-a705-601f01003170/image.png)

![](https://velog.velcdn.com/images/cllaude/post/aaea477c-4d85-4d14-ae8e-45d4c98405bb/image.png)

그 다음, 오류 페이지 탭으로 들어가서 403, 404에 대한 처리를 아래와 같이 진행해주자.

아래 화면에서 사용자 정의 오류 응답 생성을 클릭하고,
![](https://velog.velcdn.com/images/cllaude/post/b4e3b31c-f767-4ac8-a084-f25d3685e5f4/image.png)

HTTP error code에 403을 선택하고, customize error response를 yes로 체크한후 Response page path에 /index.html을 넣고, HTTP Response code에 200: 확인을 선택한다. 마찬가지로 404에 대해서도 진행하자. (아래의 화면 예시는 405인데 이미 403, 404를 설정해주었기 때문에 임의로 선택해준 것임. 405처리는 하지 않아도 된다.)

![](https://velog.velcdn.com/images/cllaude/post/03c376e7-8f2a-43a0-8c4c-688756d4b8c5/image.png)

마지막으로 Route 53 A레코드를 추가하자.

Route 53으로 돌아와서 레코드 생성 버튼을 클릭하자.

![](https://velog.velcdn.com/images/cllaude/post/58c438f7-c9b0-406a-b84c-b88692547d42/image.png)

그 후 아래와 같이 설정해주자.

![](https://velog.velcdn.com/images/cllaude/post/dcb479ff-f2dc-4fae-ab6b-72d277eecc7c/image.png)

별칭을 on으로 바꾸고 CloudFront를 선택하자. 값도 적절하게 선택해줄것. 나의 경우 `다른 레코드 추가` 버튼을 클릭하여 www에 대한 값도 적어주었다.

그렇다면 아래와 같이 2개의 A레코드가 만들어진 것을 확인할 수 있고, 구입한 도메인을 입력하여 접속한 후 프로젝트를 확인할 수 있다. (syncspot.kr, www.syncspot.kr 둘다 접속 가능)

![](https://velog.velcdn.com/images/cllaude/post/bccfa4c9-f108-49d5-ba9d-9b4bc31c2125/image.png)

> 이제 Github Actions를 통한 CI/CD를 진행하겠습니다.

배포할 때마다 S3에 파일을 하나하나 업로드 하는 것은 불편하고 반복되는 작업이다 따라서 개발, 빌드, 테스트, 배포 과정을 자동화하여 개발 속도와 소프트웨어 품질을 동시에 향상시키기 위해 CI/CD를 도입하였다.

CI(Continuous Integration, 지속적 통합)를 통해 개발자들은 코드 변경 사항을 빈번히 병합하고 자동화된 테스트를 실행하여 버그를 조기에 발견할 수 있으며, CD(Continuous Delivery/Deployment, 지속적 전달/배포)를 통해 검증된 코드를 신속하게 프로덕션 환경에 배포하여 사용자에게 빠르게 새로운 기능과 수정사항을 제공할 수 있다.

나는 패키지 매니저로 yarnberry를 사용하고 있기에 아래와 같이 cicd.yml파일을 작성해주었다.

```
name: CI/CD

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20.10.0'

      - name: Set Yarn Version
        id: set-version
        run: |
          corepack enable
          yarn set version 4.5.1
          echo "YARN_VERSION=$(yarn -v)" >> $GITHUB_OUTPUT

      - name: Yarn Cache - PnP
        uses: actions/cache@v3
        with:
          path: |
            .yarn/cache
            .pnp.*
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}-${{ steps.set-version.outputs.YARN_VERSION }}
          restore-keys: |
            ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}-

      - name: Install Dependencies
        run: yarn install

      - name: Set Environment Variables
        run: |
          echo "VITE_BACKEND_URI=${{ secrets.VITE_BACKEND_URI }}" >> $GITHUB_ENV
          echo "VITE_KAKAO_REST_API_KEY=${{ secrets.VITE_KAKAO_REST_API_KEY }}" >> $GITHUB_ENV
          echo "VITE_KAKAO_JAVASCRIPT_KEY=${{ secrets.VITE_KAKAO_JAVASCRIPT_KEY }}" >> $GITHUB_ENV

      - name: Build
        run: yarn build

  cd:
    needs: ci
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main' || github.event_name == 'pull_request' && github.base_ref == 'main'
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20.10.0'

      - name: Set Yarn Version
        id: set-version
        run: |
          corepack enable
          yarn set version 4.5.1
          echo "YARN_VERSION=$(yarn -v)" >> $GITHUB_OUTPUT

      - name: Yarn Cache - PnP
        uses: actions/cache@v3
        with:
          path: |
            .yarn/cache
            .pnp.*
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}-${{ steps.set-version.outputs.YARN_VERSION }}
          restore-keys: |
            ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}-

      - name: Install Dependencies
        run: yarn install

      - name: Set Environment Variables
        run: |
          echo "VITE_BACKEND_URI=${{ secrets.VITE_BACKEND_URI }}" >> $GITHUB_ENV
          echo "VITE_KAKAO_REST_API_KEY=${{ secrets.VITE_KAKAO_REST_API_KEY }}" >> $GITHUB_ENV
          echo "VITE_KAKAO_JAVASCRIPT_KEY=${{ secrets.VITE_KAKAO_JAVASCRIPT_KEY }}" >> $GITHUB_ENV

      - name: Build
        run: yarn build

      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
          SOURCE_DIR: ${{ secrets.SOURCE_DIR }}

```

main과 develop 브랜치에 대한 코드 변경(푸시 또는 PR)시에 대해 실행되도록 하였으며, 두 개의 jobs(ci와 cd)를 통해 애플리케이션을 빌드하고 배포하도록 하였다.

CI 단계에서는 ubuntu-latest 환경에서 Node.js 20.10.0과 Yarn 4.5.1을 설정한 뒤, Yarn 캐시를 활용하여 의존성을 설치하고 yarn build를 실행해 프로젝트를 빌드하도록 하였다.

환경 변수는 GitHub Secrets를 통해 설정하였다.

CD단계에서는 CI 성공 후 실행되며, main 브랜치에 푸시되거나 main을 대상으로 PR이 생성될 때만 동작합니다. 이 단계는 CI와 동일하게 환경 설정 및 빌드 과정을 거친 후, jakejarvis/s3-sync-action을 사용해 빌드된 정적 파일을 AWS S3 버킷에 동기화하고, --delete 옵션을 통해 불필요한 파일을 제거하도록 하였다. 이를 통해 자동으로 프로젝트가 빌드되고 배포되며, S3를 통해 정적 웹사이트가 업데이트되는 자동화된 CI/CD 환경을 구축하였다.

> `AWS_S3_BUCKET` : S3 버킷 이름
> `AWS_ACCESS_KEY_ID`: IAM 계정 생성시 얻은 액세스 키
> `AWS_SECRET_ACCESS_KEY`: IAM 계정 생성시 얻은 비밀키
> `AWS_REGION`: 리전에 해당 (나의 경우 us-east-1)
> `SOURCE_DIR`: 빌드된 파일이 저장되는 폴더 (나의 경우 vite를 사용하고 있기 때문에 dist가 된다)

## 🤔 회고

전체적인 배포 과정을 알아보면서 직접 배포해보는 과정에서 많은 것을 배웠다. 배포라고 하면 어렵기도 하고 오래걸릴줄알아서 겁을 먹고 있었는데, 의외로? 전체적인 과정을 확인해보고, 진행하다 보니 간편하게 할 수 있었다! 또한 ci/cd를 구축하여 메인 브랜치에 푸쉬하거나 풀리퀘스트를 할때에 자동으로 배포되도록 할 수 있다는 점이 신기했다!

마지막으로 이러한 경험을 공유하고자, 기록으로 남겨보는데, 글을 쓰는 솜씨가 좋지 않은것 같아 사람들로 하여금 어떻게 하면 전체적인 과정이 한눈에 보일 수 있을가에 대해서 고민을 하면서 글을 작성하다 보니 시간도 오래 걸리기도 했고, 그 과정에서 고민도 정말 많이 했던것 같다..! 이글을 보시는 분들은 나의 배포 과정을 보고 조금이나마 도움이 돼서 꼭 배포에 성공하셨으면 좋겠다 :)
