
## try catch?


에러를 일으키고, 잡아보았다.


```javascript
function main(json) {
  try {
    const jsonParsed = JSON.parse(json)
    console.log('Success: ',JSON.stringify(jsonParsed, null ,2));
    return jsonParsed;
  } catch (err) {
    console.log('Failed: ', err);
  }
}

main('{ "id": 87 }');
main('{ "id\': 87 }');

// Success:  {
//   "id": 87
// }
// Failed:  SyntaxError: Unexpected end of JSON input
//     at JSON.parse (<anonymous>)
//     at main (<anonymous>:3:29)
//     at <anonymous>:12:1
```


finally는 try, catch에서 함수가 종료되는 어떤 경우에도 실행된다


```javascript
function finallyTest(isNotTheEnd) {
  try {
    if (isNotTheEnd === true) {
      throw new Error("I'll come back.");
    }
    if (isNotTheEnd === undefined) {
      throw "Never mentioned";
    }
    return "You're eliminated";
  } catch (err) {
    if (err instanceof Error) {
      return "He will be back.";
    }
    throw "Script missing.";
  } finally {
    console.log("점심 뭐 먹으러 갈래?")
  }
  console.log("아무 말도 못 함.")
}

finallyTest();      // (예기치 못하게) 배우가 대사를 까먹음.
                    // 이후 코드는 실행되지 않게 됩니다.
                    // VM153:14 Uncaught Script missing.
                    // finallyTest @ VM153:14
                    // (anonymous) @ VM153:21
finallyTest(true);  // 시리즈 마지막이 아님. 그나저나 점심 뭐먹을래?
finallyTest(false); // 주인공 제거됨. 그나저나 점심 뭐먹을래?
```


위에서 `new Error()`로 에러 객체를 만들어봤다. MDN에 따르면, 현 시점에서 호환 이슈 없는 Error 객체의 속성은 다음과 같다 - `name`, `message`, `toString()`.


```javascript
function errorMaster() {
  const err = new Error("Error Message!");
  console.log("err.name", err.name)
  console.log("err.message", err.message)
  console.log("err.stack", err.stack)
  console.log("err.toString()", err.toString())
}

errorMaster();

// err.name Error
// err.message Error Message!
// err.stack Error: Error Message!
//     at errorMaster (<anonymous>:2:15)
//     at <anonymous>:10:1
// err.toString() Error: Error Message!
```


하나의 에러 타입으로 충분하지 않다고 생각이 되어, Error를 상속받는 새로운 에러를 만들었다


```javascript
function MissingScriptError(place,  message, fileName, lineNumber ) {
  Error.call(this,  message, fileName, lineNumber);
  
  this.name = 'MissingScriptError';
  this.missingPlace = place;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, MissingScriptError);
  }
}
MissingScriptError.prototype = Object.create(Error.prototype);
MissingScriptError.prototype.constructor = MissingScriptError;
```


이는 사실은 ES6에 들어서 다음과 같은 좀 더 심플한 구문으로 같은 코드를 짤 수 있다.


```javascript
class MissingScriptError extends Error {
  constructor(place, ...args) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MissingScriptError);
    }
    this.name = 'MissingScriptError';
    this.missingPlace = place;
  }
}
```


의도한 대로 새로운 이름을 가지는 에러 생성자가 잘 동작하는지 테스트 (스코프에 MissingScriptError가 정의되어 있다고 가정)


```javascript
function testMissingScriptError() {
  const err = new MissingScriptError('bathroom');
  console.log("err.missingPlace", err.massingPlace);
  console.log("err.name", err.name);
  console.log("err.message", err.message);
  console.log("err.stack", err.stack);
  console.log("err.toString()", err.toString());
  console.log("MissingScriptError's error?",err instanceof MissingScriptError);
  console.log("Error's error?",err instanceof Error);
}

testMissingScriptError();

// err.missingPlace bathroom
// err.name MissingScriptError
// err.message 
// err.stack MissingScriptError
//     at testMissingScriptError (<anonymous>:2:15)
//     at <anonymous>:12:1
// err.toString() MissingScriptError
// MissingScriptError's error? true
// Error's error? true
```


생각대로 잘 동작하였다. [MDN Error 참고](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error)


에러를 고의로 발생시키는 코드가 당최 왜 필요할까? 이미 우리가 작성한 세상은 에러로 가득 차 있는데? (에러를 발생시키지 않는 분들께는 죄송하다)


그럼에도 우리가 작성한 애플리케이션이 돌아가길 바라기 때문이다.


다음과 같은 페이지가 있다고 하자.


```html
<!DOCTYPE html>
<head></head>
<body>
  <h1>Hello, ${{username}}</h1>
  <script>
    // 어쩌다 사용자의 권한이 만료되었다.
    throw new Error("401: unauthorized");
    alert("권한없음");
    document.location.href = "https://google.com";
  </script>
</body>
</html>
```


사용자는 과연 얼럿을 볼 수 있을까? 브라우저의 스크립트 태그는 에러가 발생하는 순간 정지한다. 미봉책으로 다음과 같은 코드를 넣을 수도 있을 것이다.


```html
<!DOCTYPE html>
<head></head>
<body>
  <h1>Hello, ${{username}}</h1>
  <script>
    window.onerror = function (message, source, lineno, colno, error) {
      alert(lineno+","+colno+": 에서 예기치 못한 에러 발생");
      if (error.message.startsWith('401')) {
        alert("권한없음");
        document.location.href = "https://google.com";
      }
    }
    // 어쩌다 사용자의 권한이 만료되었다.
    // throw new Error("401: unauthorized");
    var title = document.querySelector('body h1');
    title.innerText = title.innerText.replace('${{username}}', 'yourname');
  </script>
</body>
</html>
```


위의 예시는 그나마 괜찮다. 하지만 실제 개발을 진행하다 보면 바닥을 알 수 없는 함수들을 만나곤 한다. 콜스택이 몇 백개 쌓인 코드를 작성중인데 런타임 에러가 발생하는데, 발생한 함수의 위치가 스크롤을 두세번 해야 보이면서 실은 내가 짠 코드도 아닐 때가 많다. 당황할 게 아니라, 거기서 에러를 잡았으니 실은 안도해야 한다. 거기서 에러를 던지지 않았으면 그냥 애플리케이션이 죽게 되기 때문이다.


… 정말 죽는게 맞나? 스크립트 태그를 나눠 다시 작성해봤다. mainOne 함수는 30%의 확률로 죽게 된다. 첫 번째 카운터는 에러가 발생하면 올라가지 않는다. 그러나 여전히 mainTwo 함수는 실행된다. 따라서 웹페이지가 죽기보다는, 스크립트 태그 하나를 실행하는 각자의 독립적인 익명 함수가 있는데, 이게 throw 를 통해 제대로 종료되지 않으면 window.onerror 함수가 실행되는 것으로 보인다.


```html
<!DOCTYPE html>
<html>
<head></head>
<body>
  <h1 id="counter-one">Counter One, <span>0</span></h1>
  <h1 id="counter-two">Counter Two, <span>0</span></h1>
  <script>
    window.onerror = function (message, source, lineno, colno, error) {
      console.log('onerror:message',message)
      console.log('onerror:source',source)
      // setTimeout(mainOne,500);
    }
  </script>
  <script>
    function mainOne() {
      let title = document.querySelector('#counter-one span');
      let _count = +title.innerText
      title.innerText = title.innerText = _count +1;
      if (Math.random() > 0.7) {
        throw new Error("어쩌다 첫 번째 카운터에서 에러가 났음");
      }
      setTimeout(mainOne, 100);
    }
    mainOne();
  </script>
  <script>
    function mainTwo() {
      let title = document.querySelector('#counter-two span');
      let _count = +title.innerText
      title.innerText = title.innerText = _count +1;
      // if (Math.random() > 0.7) {
      //   throw new Error("어쩌다 두 번째 카운터에서 에러가 났음");
      // }
      setTimeout(mainTwo, 1000);
    }
    mainTwo();
  </script>
</body>
</html>
```

