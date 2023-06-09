
### Type

- 원시 타입 - `boolean`, `number`, `string`, `null`, `undefined`
- 참조 타입 - `array`, `function`, `object`
- 어떤 타입으로 이루어진 배열: `any[]`, `number[]`, `SomeType[]`
- Typescript에만 있음: `any`, `never`, `void`, `unknown`
- undefined를 리턴하는 함수

```typescript
const returnUndefined: () => void = () : void => {}
```

- 결코 return 하지 않는 함수

```typescript
const infiniteLoop = (): never => {
  while(true) {
    // Do something
  }
  // Unreachable Code
}
```


```typescript
const errorDriven = (): never => {
  throw new Error();
  // Unreachable Code
}
```


만약 위 while문에서 break;의 가능성이 있다면, never가 잘못됨.

- type alias

```typescript
type Note = string;
type Post = {
  title: string,
  body: string,
}
```

- type union

```typescript
type Fruit = Apple | Banana | Strawberry
```

- literal type

```typescript
const helloWorld = "Hello World";
```


여기서 helloWorld 변수의 타입은 string이 아닌 “Hello World” 타입이 됨. 물론 다음과 같이 별 의미는 없지만 string 타입으로 지정할 수도 있음. 의미가 없는 이유는 당연하게도 해당 변수에 값을 재할당할 수 없기 때문.


```typescript
const helloWorld : string = "Hello World";
```

- discriminated type : 사리분별이 되는 타입; 이란 뜻이다.

```typescript
type MsgError = {
  type: 'error',
  description: string,
}

type MsgOkay = {
  type: 'okay',
  data: {
    no: number,
    title: string,
    body: string,
  }
}

type Msg = MsgOkay | MsgError;

function main(msg: Msg): void {
  /**
   * console.log(msg.data); // => TSError
   */

  if (msg.type === 'okay') {
    console.log(msg.data);
  }
}
```


tsc가 무턱대고 TSError를 던지지 않고, 분기문을 이해하니 위와 같이 활용하면 된다.

- intersection type : 교집합 타입;

위에서 Msg 타입들을 다른 방법으로 이렇게 정의할 수 있다.


```typescript
type MsgBase<T> = {
  type: T,
};

type MsgError = MsgBase<'error'> & { description: string };

type MsgOkay = MsgBase<'okay'> & {
  data: {
    no: number,
    title: string,  
    body: string,
  }
};

type Msg = MsgOkay | MsgError;
```


> 뜨거운 감자인 _**interface vs type**_는 이제는 위와 같이 intersection type으로 interface의 extends 가 가능하므로, 과거에 권장되던 interface만 굳이 사용할 필요는 없다.


### Interface

- 어떤 객체의 구조를 각각 type과 interface로

```typescript
type TGift = {
  eatable: boolean,
  gram: number,
  width: number,
  height: number,
  depth: number,
  name: string
}

interface IGift {
  eatable: boolean;
  gram: number;
  width: number;
  height: number;
  depth: number;
  name: string;
}

let giftOne: TGift = {
  eatable: true,
  gram: 1400,
  width: 200,
  height: 120,
  depth: 50,
  name: 'notebook'
}

let giftTwo: IGift = {
  eatable: true,
  gram: 1400,
  width: 200,
  height: 120,
  depth: 50,
  name: 'notebook'
}
```


별 차이가 없으나, interface는 여러 번의 선언을 통해 타입에 속성을 merge할 수 있다. 타입으로는 이런 식으로 할 수 없다. 개인적으로는 이렇게 여기저기 흩어져 있으면 오히려 type이 더 명료해 보이겠다는 생각이다. `cmd + click`으로 해당 타입을 눌러 정의 부분을 찾아 들어갔는데 여기저기 흩어져 있으면 좀 곤란할 것 같다.


```typescript
interface IGift {
  eatable: boolean;
}

interface IGift {
  gram: number;
  width: number;
  height: number;
  depth: number;
}

interface IGift {
  name: string;
}

let giftTwo: IGift = {
  eatable: true,
  gram: 1400,
  width: 200,
  height: 120,
  depth: 50,
  name: 'notebook'
}
```

- type은 데이터의 구조에, interface는 클래스의 구조 정의에 좀 더 찰떡인 걸로 권장되는 듯 하다. 다른 언어에서 대개 각각의 키워드가 뜻하는 관용적인 부분을 참고

```typescript
// 위의 TGift, IGift가 이미 정의되어 있다는 가정하에

interface IGift {
  getVolume: () => number;
}

class Gift implements IGift {
  eatable: boolean;
  gram: number;
  width: number;
  height: number;
  depth: number;
  name: string;
  constructor(giftConfig: TGift) {
    this.depth = giftConfig.depth;
    this.name = giftConfig.name;
    this.width = giftConfig.width;
    this.height = giftConfig.height;
    this.gram = giftConfig.gram;
    this.eatable = giftConfig.eatable;
  }

  getVolume(): number {
    return this.width * this.height * this.depth;
  }
}

const newGift = new Gift(giftOne);

console.log(newGift.getVolume());
```

