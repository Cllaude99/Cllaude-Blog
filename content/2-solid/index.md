---
emoji: 📐
title: '하나의 컴포넌트에 하나의 책임을'
date: '2025-03-16'
categories: featured-Dev
---

평소 개발을 하면서 `좋은 코드란 무엇일까?` 에 대해 많은 고민을 하는 것 같다.
사람마다 `좋은 코드`에 대한 기준은 다를 수 있겠지만 내가 생각하는 좋은 코드란 변화에 대응을 잘 하는 코드라고 생각한다.
즉 어떠한 기능에 대해 수정 요청이 있을 때 "어, 이 기능이 추가되면 모든 코드를 갈아 엎어야 할 것 같아요." 라고 답변을 하게 된다면 해당 코드는 좋지 못한 코드라고 생각한다.

그렇다면 왜 변화에 잘 대응하는 코드가 좋은 코드일까?

> 그 이유는 사용자의 요구사항은 끊임없이 변화하기 때문이다.

아래는 내가 [syncspot](https://syncspot.kr/) 프로젝트를 개발하면서 기획자로부터 받은 요구사항 중 일부이다.

1. 장소 입력 기능에서 입력 부분 아래 추천 검색 목록도 볼 수 있도록 변경해주세요.

2. 모바일에서는 지도를 더 크게 보여주고, 장소 목록은 스와이프로 볼 수 있게 해주세요.

첫 번째 요구사항에서 만약 장소를 입력하는 코드가 컴포넌트로 분리되어 있지 않고 하나의 파일내에 함수로 관리되고 있다면 어떻게 될까? 또는 장소를 입력하는 컴포넌트가 이미 너무 많은 책임(입력한 키워드에대해 도로명 주소를 검색, 입력 UI를 보여줌, 추천 검색 목록을 보여줌 등등)을 가지고 있다면 어떨까? 아마 해당 코드를 찾는 과정도 힘들게 되고 이에 따라 간단한 요구사항도 구현하기 어려워 질 것 같다.

두 번째 요구사항에서 만약 지도를 보여주는 부분과 사용자가 선택한 좌표에 대해 받아오고 추가하는 과정이 파일내에 있다면, 즉 비즈니스 로직이 UI 컴포넌트와 섞여 있다면, 이런 작은 변경도 복잡해 질 것이다.

이렇듯 사용자의 요구사항은 끊임없이 변경되기 때문에 이러한 변화에 큰 애로사항없이 잘 대응하기 위해선 소프트웨어 설계 근간이 좋아야 한다고 생각한다.

> 그렇다면 위의 요구사항을 잘 대응하기 위해서 코드를 어떻게 코드를 짜는 것이 좋을까?

나는 기존의 코드보다 더 확장성이 있는 시스템 구조를 만들기 위해서는 하나의 컴포넌트에는 하나의 책임을 부여하는 방식으로 코드를 짤 수 있을 것 같다고 생각했고 SOLID의 단일 책임 원칙(SRP)을 적용하여 기존 코드의 유지 보수성을 높이고자 했다.

아래는 현재 `장소 입력 컴포넌트 (LocationEnterPage)`의 코드이다.

```javascript
interface ILocationForm {
  myLocations: IPlaceSaveRequestType[];
  friendLocations: IPlaceSaveRequestType[];
}

export default function LocationEnterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { roomId } = useParams();
  const lastLocationRef = useRef<HTMLLIElement>(null);
  const locationListRef = useRef<HTMLUListElement>(null);
  const [savedLocations, setSavedLocations] = useState<ILocation[]>([]);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(500);

  // 장소 목록 조회 쿼리
  const { data: placeSearchData } = useGetPlaceSearchQuery({
    enabled: !!roomId,
  });
  const { data: userInfo } = useGetUserInfoQuery();

  const { mutate: placeSaveMutation } = usePlaceSaveMutation(); // 장소 저장
  const { mutate: placeUpdateMutation } = usePlaceUpdateMutation(); // 장소 수정
  const { mutate: placeDeleteMutation } = usePlaceDeleteMutation(); // 장소 삭제

  const { control, setValue, watch, reset } = useForm<ILocationForm>({
    defaultValues: {
      myLocations: [],
      friendLocations: [],
    },
  });

  const {
    fields: myLocationFields,
    append: appendMyLocation,
    remove: removeMyLocation,
  } = useFieldArray({
    control,
    name: 'myLocations',
  });

  const { fields: friendLocationFields } = useFieldArray({
    control,
    name: 'friendLocations',
  });

  const myLocations = watch('myLocations');
  const friendLocations = watch('friendLocations');

  const isAllMyLocationsFilled =
    myLocations.length > 0 &&
    myLocations.every((loc) => loc.addressLat !== 0 && loc.addressLong !== 0);

  useEffect(() => {
    if (placeSearchData?.data) {
      // 내 장소가 없고, 사용자의 기본 주소가 있는 경우에만 자동 저장
      ...
      } else {
        ...
      }
    }
  }, [placeSearchData?.data, userInfo?.data, reset, placeSaveMutation]);

  useEffect(() => {
    if (
      lastLocationRef.current &&
      myLocationFields.length >
        (placeSearchData?.data?.myLocations?.length || 0)
    ) {
      const isMobile = window.innerWidth < 1024;

      ...
    }
  }, [myLocationFields.length, placeSearchData?.data?.myLocations?.length]);

  const handleLocationSelect = (location: ISelectedLocation, index: number) => {
    ...
  };

  const handleDeleteLocation = (index: number) => {
    ...
  };

  const isValidLocation = (loc: (typeof myLocations)[0]) =>
    loc.addressLat !== 0 && loc.addressLong !== 0;

  const formatLocations = (
    locations: typeof myLocations | undefined,
    isMyLocation: boolean,
  ) =>
    locations?.filter(isValidLocation).map((location) => ({
      lat: location.addressLat,
      lng: location.addressLong,
      isMyLocation,
      roadNameAddress: location.roadNameAddress,
    })) || [];

  const coordinates = [
    ...formatLocations(myLocations, true),
    ...formatLocations(friendLocations, false),
  ];

  const shouldShowMap = coordinates.length > 0;

  const handleAddLocation = () => {
    appendMyLocation({
      siDo: '',
      siGunGu: '',
      roadNameAddress: '',
      addressLat: 0,
      addressLong: 0,
    });
  };

  const getScrollAreaStyle = (bottomSheetHeight: number) => {
    ...
  };

  return (
    <>
      <div className="hidden lg:grid w-full grid-cols-2 px-[7.5rem] gap-[0.9375rem] mt-[1.5625rem]">
        <div className="flex flex-col order-2 p-5 rounded-default bg-gray-light lg:order-1 lg:max-h-[calc(100vh-8rem)]">
          <h1 className="flex items-center justify-center text-subtitle lg:text-title text-tertiary my-[1.25rem] lg:my-[1.5625rem]">
            모임 정보 입력
          </h1>
          <h1 className="mb-1 lg:mb-[0.375rem] ml-2 text-menu lg:text-subtitle text-tertiary">
            내가 입력한 장소
          </h1>
          <ul
            ref={locationListRef}
            className="flex flex-col p-1 max-h-[calc(100vh-38rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-normal scrollbar-track-transparent scrollbar-thumb-rounded-full"
          >
            {myLocationFields.length === 0 ? (
              <li className="flex items-center justify-center py-4 text-description lg:text-content text-gray-dark">
                아래 장소 추가하기 버튼을 클릭해 장소를 추가해보세요!
              </li>
            ) : (
              myLocationFields.map((field, index) => (
                <li
                  key={field.id}
                  ref={
                    index === myLocationFields.length - 1
                      ? lastLocationRef
                      : null
                  }
                  className="flex group/location relative items-center justify-between bg-white-default rounded-default mb-[0.625rem] hover:ring-1 hover:ring-gray-normal z-10"
                >
                  <KakaoLocationPicker
                    InputClassName="w-full text-description lg:text-content bg-white-default py-[1.3125rem] truncate"
                    onSelect={(location) =>
                      handleLocationSelect(location, index)
                    }
                    defaultAddress={field.roadNameAddress}
                    usePortal={true}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteLocation(index)}
                    className="p-1 mx-2 rounded-[0.5rem] hover:bg-gray-normal absolute right-0 group/deleteButton hidden group-hover/location:block"
                  >
                    <IconXmark className="transition-none size-4 text-gray-normal group-hover/deleteButton:text-gray-dark" />
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="flex items-center mb-1 lg:mb-[0.375rem] mt-2 lg:mt-4 ml-2 justify-between">
            <h1 className=" text-menu lg:text-subtitle text-tertiary">
              친구가 입력한 장소
            </h1>
            <ShareButton />
          </div>
          <div className="max-h-[calc(100vh-38rem)] mb-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-normal scrollbar-track-transparent scrollbar-thumb-rounded-full">
            {friendLocationFields.length === 0 ? (
              <div className="flex items-center justify-center py-4 text-description lg:text-content text-gray-dark">
                아직 친구가 장소를 입력하지 않았습니다
              </div>
            ) : (
              friendLocationFields.map((field) => (
                <div
                  key={field.id}
                  className="w-full text-description lg:text-content bg-white-default rounded-default truncate mb-[0.625rem] py-[1.3125rem] pl-[0.9375rem] cursor-not-allowed opacity-70"
                >
                  {field.roadNameAddress || '위치 정보 없음'}
                </div>
              ))
            )}
          </div>
          <div className="flex flex-col mt-auto gap-[0.5rem]">
            <Button
              buttonType="secondary"
              onClick={handleAddLocation}
              className="px-[0.3125rem] w-full"
            >
              장소 추가하기
            </Button>
            <Button
              buttonType="primary"
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: ROOM_QUERY_KEY.GET_CHECK_LOCATION_ENTER(roomId!),
                });
                navigate(PATH.LOCATION_RESULT(roomId!));
              }}
              disabled={!isAllMyLocationsFilled}
              className="px-[0.3125rem] w-full"
            >
              중간 지점 찾기
            </Button>
          </div>
        </div>
        <div className="rounded-default min-h-[calc(100vh-8rem)] order-1 lg:order-2">
          <KakaoMap coordinates={shouldShowMap ? coordinates : []} />
        </div>
      </div>

      <div className="lg:hidden">
        <div className="fixed inset-0 top-[4.75rem]">
          <KakaoMap coordinates={shouldShowMap ? coordinates : []} />
        </div>

        <BottomSheet
          minHeight={30}
          maxHeight={90}
          initialHeight={50}
          headerHeight={40}
          onHeightChange={(height) => setBottomSheetHeight(height)}
        >
          <div className="flex flex-col h-full">
            <h1 className="flex items-center justify-center my-4 text-subtitle text-tertiary">
              모임 정보 입력
            </h1>
            <div className="flex-1 px-4 overflow-y-auto">
              <h1 className="mb-1 ml-2 text-menu text-tertiary">
                내가 입력한 장소
              </h1>
              <ul
                className={`flex flex-col p-1 ${getScrollAreaStyle(bottomSheetHeight)} scrollbar-thin scrollbar-thumb-gray-normal scrollbar-track-transparent scrollbar-thumb-rounded-full transition-all duration-300 ease-in-out`}
              >
                {myLocationFields.length === 0 ? (
                  <li className="flex items-center justify-center py-4 text-description text-gray-dark">
                    아래 장소 추가하기 버튼을 클릭해 장소를 추가해보세요!
                  </li>
                ) : (
                  myLocationFields.map((field, index) => (
                    <li
                      key={field.id}
                      ref={
                        index === myLocationFields.length - 1
                          ? lastLocationRef
                          : null
                      }
                      className="flex relative items-center justify-between bg-white-default rounded-default mb-[0.625rem] ring-1 ring-gray-normal lg:ring-0 lg:hover:ring-1 lg:hover:ring-gray-normal"
                    >
                      <KakaoLocationPicker
                        InputClassName="w-full text-description bg-white-default py-[1.0625rem] truncate pr-12"
                        onSelect={(location) =>
                          handleLocationSelect(location, index)
                        }
                        defaultAddress={field.roadNameAddress}
                        usePortal={true}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteLocation(index)}
                        className="p-1 mx-2 rounded-[0.5rem] hover:bg-gray-normal absolute right-0 lg:hidden lg:group-hover/location:block"
                      >
                        <IconXmark className="transition-none size-4 text-gray-normal group-hover/deleteButton:text-gray-dark" />
                      </button>
                    </li>
                  ))
                )}
              </ul>

              <h1 className="mt-2 mb-1 ml-2 text-menu text-tertiary">
                친구가 입력한 장소
              </h1>
              <div
                className={`mb-2 ${getScrollAreaStyle(bottomSheetHeight)} scrollbar-thin scrollbar-thumb-gray-normal scrollbar-track-transparent scrollbar-thumb-rounded-full transition-all duration-300 ease-in-out`}
              >
                {friendLocationFields.length === 0 ? (
                  <div className="flex items-center justify-center py-4 text-description text-gray-dark">
                    아직 친구가 장소를 입력하지 않았습니다
                  </div>
                ) : (
                  friendLocationFields.map((field) => (
                    <div
                      key={field.id}
                      className="w-full text-description text-gray-dark truncate mb-[0.625rem] py-[1.0625rem] pl-[0.9375rem] cursor-not-allowed opacity-70 bg-gray-light rounded-default"
                    >
                      {field.roadNameAddress}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[0.5rem] px-4 py-6 bg-white-default">
              <Button
                buttonType="secondary"
                onClick={handleAddLocation}
                className="px-[0.3125rem] w-full"
              >
                장소 추가하기
              </Button>
              <Button
                buttonType="primary"
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ROOM_QUERY_KEY.GET_CHECK_LOCATION_ENTER(roomId!),
                  });
                  navigate(PATH.LOCATION_RESULT(roomId!));
                }}
                disabled={!isAllMyLocationsFilled}
                className="px-[0.3125rem] w-full"
              >
                중간 지점 찾기
              </Button>
            </div>
          </div>
        </BottomSheet>
      </div>
    </>
  );
}

```

위 코드의 경우 약 500줄이 넘어가고 있으며, 모든 로직이 하나의 컴포넌트에 담겨있어 컴포넌트가 너무 복잡해지고 이에 따라 유지보수가 어려워진다는 문제가 있다.

해당 코드의 문제를 세분화하면 다음과 같다.

- 데이터 페칭
- 폼 처리
- 이벤트 처리
- 조건부 렌더링으로 UI를 분기
- 중복되는 코드

최종적으로 하나의 컴포넌트에 모든 로직이 담겨있어 컴포넌트 하나에 너무 많은 역할이 부여되어 있고 이에 따라 요구 사항 변경이 어렵다는 문제가 있다.

따라서 나는 Context API, 커스텀 훅, 컴포넌트 분리 등을 통해 해당 문제를 해결하고자 했다.

### Context Provider를 사용하며, 디바이스 타입에 따라 장소 입력 컴포넌트를 데스크톱과 모바일로 분리

`LocationEnterPage.tsx`

```javascript
import { useDeviceType } from '@src/hooks/useDeviceType';
import DesktopLocationEnter from '@src/components/location/LocationEnterPage/DesktopLocationEnter';
import MobileLocationEnter from '@src/components/location/LocationEnterPage/MobileLocationEnter';
import { LocationProvider } from '@src/components/location/LocationEnterPage/LocationContext';

export default function LocationEnterPage() {
  const { isMobile } = useDeviceType();

  return (
    <LocationProvider>
      {isMobile ? <MobileLocationEnter /> : <DesktopLocationEnter />}
    </LocationProvider>
  );
}
```

먼저 모바일과 데스크톱에 따라 MobileLocationEnter, DesktopLocationEnter 컴포넌트로 분리해주었다. 이후 각 컴포넌트에 필요한 props들을 전달해주려고 하였다. 하지만 여기서 작은 문제가 생겼다. 두 컴포넌트에 공통적으로 넘겨주는 props가 많았으며 심지어 해당 컴포넌트에서 사용되지 않고 자식에게 넘겨주는 prop도 존재하였다. 이는 불필요한 props drilling을 발생시키는 과정이라고 생각하였고 이를 해결하기 위해 Context API를 사용하여 상태와 함수를 공유하고자 했다.

최종적으로 위와 같이 장소 입력 컴포넌트에 `디바이스 타입에 따라 적절한 UI 컴포넌트를 렌더링` 이라는 하나의 책임을 부여하는 방식으로 리팩토링 하였다.

### API 호출 관련 로직을 별도의 커스텀 훅으로 분리

```javascript
import { useParams } from 'react-router-dom';
import { useGetPlaceSearchQuery } from '@src/state/queries/location/useGetPlaceSearchQuery';
import { useGetUserInfoQuery } from '@src/state/queries/users/useGetUserInfoQuery';

export function useLocationData() {
  const { roomId } = useParams();

  const { data: userInfo } = useGetUserInfoQuery();
  const { data: placeSearchData } = useGetPlaceSearchQuery({
    enabled: !!roomId,
  });

  return {
    placeSearchData,
    userInfo,
  };
}
```

장소 입력 컴포넌트에 필요한 초기 데이터(사용자의 기본 주소, 친구의 장소 목록, 내가 입력한 장소 목록)를 페칭하는 로직을 별도의 커스텀 훅(useLocationData)으로 분리했다.

이를 통해 데이터 페칭 로직을 재사용할 수 있게 되었으며 컴포넌트에서 데이터 페칭 관련 코드가 제거되어 가독성이 향상되었다.

### 폼 상태 관리 로직을 별도의 커스텀 훅으로 분리

```javascript
import { IPlaceSaveRequestType } from '@src/types/location/placeSaveRequestType';
import { useForm, useFieldArray } from 'react-hook-form';

export interface ILocationForm {
  myLocations: IPlaceSaveRequestType[];
  friendLocations: IPlaceSaveRequestType[];
}

export function useLocationForm() {
  const {
    control,
    setValue: setLocationValue,
    watch,
    reset: resetLocation,
  } = useForm <
  ILocationForm >
  {
    defaultValues: {
      myLocations: [],
      friendLocations: [],
    },
  };

  const {
    fields: myLocationFields,
    append: appendMyLocation,
    remove: removeMyLocation,
  } = useFieldArray({
    control,
    name: 'myLocations',
  });

  // ... 기타 폼 관련 로직 ...

  return {
    control,
    setLocationValue,
    resetLocation,
    myLocationFields,
    friendLocationFields,
    removeMyLocation,
    appendMyLocation,
    handleAddLocation,
    myLocations,
    friendLocations,
    isAllMyLocationsFilled,
    coordinates,
    shouldShowMap,
  };
}
```

기존 장소 입력 컴포넌트의 경우 React Hook Form을 사용하여 내가 입력한 목록, 친구가 입력한 목록을 관리하였으며 데이터 페칭 이후 폼 필드를 설정해주는 과정, 장소 입력 필드의 추가/제거 등의 과정이 다른 역할들과 함께 하나의 파일내부에 있어 이에 대한 확인이 어려웠다.

이를 해결하기 위해 폼 상태 관리 로직을 별도의 커스텀 훅으로 분리하여 해당 로직을 재사용할 수 있게 하였다

### 위치 관련 API 호출 로직 분리

```javascript
export function useLocationMutations({
myLocations,
friendLocations,
setLocationValue,
removeMyLocation,
}: UseLocationMutationsProps) {
const [savedLocations, setSavedLocations] = useState<ILocation[]>([]);
const { mutate: placeSaveMutation } = usePlaceSaveMutation();
const { mutate: placeUpdateMutation } = usePlaceUpdateMutation();
const { mutate: placeDeleteMutation } = usePlaceDeleteMutation();

const handleLocationSelect = (location: ISelectedLocation, index: number) => {
// 위치 선택 처리 로직
// 중복 체크, 기존 위치 업데이트 또는 새 위치 저장
// ...
};

const handleLocationUpdate = (
placeId: number,
newLocation: INewLocation,
index: number,
) => {
// 위치 업데이트 API 호출 및 상태 업데이트
// ...
};

const handleDeleteLocation = (index: number) => {
// 위치 삭제 API 호출 및 상태 업데이트
// ...
};

return {
savedLocations,
setSavedLocations,
handleLocationSelect,
handleDeleteLocation,
};
}
```

장소에 대한 추가, 수정, 삭제와 관련된 API 호출 로직을 별도의 훅으로 분리했다.

### 초기 데이터 설정 로직 분리

```javascript
export function useLocationInitialization({
  placeSearchData,
  userInfo,
  resetLocation,
  setSavedLocations,
}: UseLocationInitializationProps) {
  const { mutate: placeSaveMutation } = usePlaceSaveMutation();

  useEffect(() => {
    if (placeSearchData?.data) {
      // 초기 데이터 설정 로직
      // 사용자 기본 주소가 있는 경우 자동 저장
      // 기존 위치 데이터 로드
      // ...
    }
  }, [
    placeSearchData?.data,
    userInfo?.data,
    resetLocation,
    placeSaveMutation,
    setSavedLocations,
  ]);
}
```

위와 같이 컴포넌트 초기화 시 필요한 데이터에 대해 초기화 로직을 분리하였다.
사용자의 기본 주소가 있는 경우 자동으로 저장하는 과정, 기존 위치 데이터 로드 등의 과정을 담당하도록 하였다.

### 컨텍스트 API를 통한 상태 공유

위에서 분리한 모든 로직을 통합하고 하위 컴포넌트에 전달하기 위한 컨텍스트를 다음과 같이 만들었다.

```javascript
import React, { createContext, useContext, ReactNode, useRef } from 'react';
import { ISelectedLocation } from '@src/components/common/kakao/types';
import { useLocationData } from '@src/hooks/location/useLocationData';
import { useLocationForm } from '@src/hooks/location/useLocationForm';
import { useLocationMutations } from '@src/hooks/location/useLocationMutations';
import { useLocationInitialization } from '@src/hooks/location/useLocationInitialization';
import { useAutoScroll } from '@src/hooks/location/useAutoScroll';

interface ILocationField {
  id: string;
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
}

interface ICoordinate {
  lat: number;
  lng: number;
  isMyLocation: boolean;
  roadNameAddress: string;
}

interface LocationContextType {
  // 위치 데이터
  myLocationFields: ILocationField[];
  friendLocationFields: ILocationField[];
  coordinates: ICoordinate[];
  shouldShowMap: boolean;

  // 장소 입력 필드에 대한 ref
  lastLocationRef: React.RefObject<HTMLLIElement>;
  locationListRef: React.RefObject<HTMLUListElement>;

  // 장소 수정,저장,삭제,추가
  handleLocationSelect: (location: ISelectedLocation, index: number) => boolean;
  handleDeleteLocation: (index: number) => void;
  handleAddLocation: () => void;

  // 모든 장소가 입력되었는지 여부
  isAllMyLocationsFilled: boolean;
}

const LocationContext =
  createContext <
  LocationContextType >
  {
    myLocationFields: [],
    friendLocationFields: [],
    coordinates: [],
    shouldShowMap: false,
    lastLocationRef: { current: null },
    locationListRef: { current: null },
    handleLocationSelect: () => false,
    handleDeleteLocation: () => {},
    handleAddLocation: () => {},
    isAllMyLocationsFilled: false,
  };

export function LocationProvider({ children }: { children: ReactNode }) {
  const lastLocationRef = useRef < HTMLLIElement > null;
  const locationListRef = useRef < HTMLUListElement > null;

  const { placeSearchData, userInfo } = useLocationData();

  const {
    myLocationFields,
    friendLocationFields,
    setLocationValue,
    resetLocation,
    removeMyLocation,
    handleAddLocation,
    myLocations,
    friendLocations,
    isAllMyLocationsFilled,
    coordinates,
    shouldShowMap,
  } = useLocationForm();

  const {
    handleLocationSelect,
    handleDeleteLocation,
    savedLocations,
    setSavedLocations,
  } = useLocationMutations({
    myLocations,
    friendLocations,
    setLocationValue,
    removeMyLocation,
  });

  /_ 초기 데이터 설정 _/;
  useLocationInitialization({
    placeSearchData,
    userInfo,
    resetLocation,
    setSavedLocations,
  });

  /_ 스크롤 자동 이동 _/;
  useAutoScroll({
    lastLocationRef,
    locationListRef,
    currentLocationsCount: myLocationFields.length,
    savedLocationsCount: savedLocations.length,
  });

  const value = {
    myLocationFields,
    friendLocationFields,
    coordinates,
    shouldShowMap,
    lastLocationRef,
    locationListRef,
    handleLocationSelect,
    handleDeleteLocation,
    handleAddLocation,
    isAllMyLocationsFilled,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  return context;
}
```

이러한 리팩토링을 통해 다음과 같은 이점을 얻을 수 있었다.

먼저 각 파일이 하나의 명확한 책임을 가지게 되어 코드의 가독성이 크게 향상되었다. 예를 들어 useLocationData.ts는 오직 데이터 페칭에만 집중하고 MyLocationList.tsx는 오직 내 위치 목록 UI 렌더링에만 집중한다.

다음으로 특정 기능을 수정할 때 관련 파일만 수정하면 요구사항에 따른 반영도 쉬워졌고 이에 따라 유지보수가 용이해졌다. 예를 들어 위치 선택 로직을 수정하려면 useLocationMutations.ts만 수정하면 된다.

마지막으로 가독성이 좋아졌다. 협엽 시에 다른 개발자들로 하여금 시점 이동이 줄어들게 되어 코드를 더욱 쉽게 이해할 수 있게 되었다.

이번 리팩토링을 통해 단일 책임 원칙과 관심사 분리의 중요성을 실감할 수 있었다. 문제를 정의하는 것부터 시작하여 거대한 컴포넌트를 작은 단위로 분리하고, 로직을 커스텀 훅으로 추출하는 과정으로 통해 이전보다 더 나은 코드를 만들 수 있었다.
