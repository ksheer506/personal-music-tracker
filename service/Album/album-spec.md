# Album 및 AlbumArtist 관련 정책

하나의 Album에 대해서 "main"은 최대 하나만 존재해야 하며, 
둘 이상의 아티스트가 존재하는 경우 "main", "main" - "contributor", "various"의 조합만 가능하다.
"main" -> "various"로의 전환은 허용되지만, "various" -> "main"으로의 전환은 불허된다.

**허용**
1. albumA - artist1(main)
2. albumA - artist1(main), albumA - artist2(contributor)
3. albumA - artist1(various), albumA - artist2(various)

**비허용**
1. albumA - artist1(main), albumA - artist2(main)
2. albumA - artist1(main), albumA - artist2(various)
3. albumA - artist1(various)       <- 반드시 albumA - artist2(various)와 함께 존재해야 한다
4. albumA - artist1(various), albumA - artist2(contributor)
5. albumA - artist1(contributor)   <- 반드시 albumA - artist2(main)과 함께 존재해야 한다
6. albumA - artist1(contributor), albumA - artist2(contributor)

## 1. 서로 다른 두 아티스트의 앨범명이 동일한 경우
```js
trackA - albumA - artist1(main) // 기존 DB
trackB - albumA - artist2(main) // 신규 추가
```
externalId 값에 따라 판단해야 함. 
externalId 값이 없다면 albumA - artist2(main)을 별도 항목으로 추가(서로 다른 아티스트의 앨범인지 Various Artists 앨범의 서로 다른 두 곡인지 판단하기 어렵기 때문)

## 2. 앨범명, 아티스트명이 동일한 AlbumArtist 항목에 대해 role만 다른 항목이 추가되는 경우
특정 아티스트의 앨범에서 일부 곡만 feat/with/multiple일 수 있음

```js
trackA - albumA - artist1(main) // 기존 DB
trackB - albumA - artist1(various), artist2(various) // 신규 추가
```

1. role 조건 없이 title + artistId로 조회

2. 조회된 앨범이 존재:
  - album_title, artist, role이 모두 동일한 경우 해당 결과 반환 
  
  - albumA - artist1(main) 존재, albumA - artist1(various) 추가          -> albumA - artist1(various) 변경

  - albumA - artist1(various) 존재, albumA - artist1(main) 추가          -> albumA - artist1(various) 유지

  - albumA - artist1(contributor) 존재, albumA - artist1(main) 추가      -> albumA - artist1(various) 변경
  - albumA - artist1(contributor) 존재, albumA - artist1(various) 추가   -> albumA - artist1(various) 변경

3. 조회된 앨범이 존재하지 않음: 특별한 변환 과정 없이 추가
