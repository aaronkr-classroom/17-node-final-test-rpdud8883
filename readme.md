[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Todgmdva)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=15298012)
# Final Test / 기말고사

## 목적:

Add CRUD Methods to the Express Server.<br>Express 서버에 CRUD 메소드 추가하기.

**Hint:** 

Copy the required actions from `usersController.js` into `discussionsController.js`, and the `user` routes in `app.js`. Change all instances of `user` to `discussion` and maintain the correct spelling (`User` = `Discussion`, `users` = `discussions`, etc).<br>`usersController.js`의 필수 작업을 `discussionsController.js`에 복사하고 `user` 경로는 `app.js`에 복사합니다. 모든 `user` 인스턴스를 `discussion`으로 변경하고 올바른 철자를 유지합니다(`User` = `Discussion`, `users` = `discussions` 등).

## 단계:

1. 이전 개인 코드 저장소에서 개인 MongoDB 링크를 가지고오고 `app.js`에서 있는 링크를 덮어써세요.
2. 아래 있는 `Discussions` (`포럼`) 코드를 작성하세요.
3. `npm install` 실행하세요.
4. `npm start` 실행하세요.
5. 웹사이트에서 새로운 사용자가 등록하세요.
6. 로그인하고 `포럼` 페이지에서 새로운 `Discussion` 만들어 보세요.
7. 새로 만든 `Discussion`에서 `Comment` 여러 번 작성하세요.
8. 모든 기능이 가능하면 **성공!** 제출하고 좋은 여름 방학보내세요~~

## 설명:

This is an example of a _simple_ forum website. But there's one problem. The `discussionsController` is missing its CRUD methods. You need to add them.<br>이것은 _간단한_ 포럼 웹사이트의 예제입니다. 하지만 한가지 문제가 있습니다. `discussionsController`에 CRUD 메소드가 없습니다. 이것을 추가해야 합니다.

There are two files to change: `app.TODO.js` and `discussionsController.TODO.js`.<br>변경할 파일은 두개입니다: `app.TODO.js`와 `discussionsController.TODO.js` 입니다.

### app.js

In `app.js`, you need to add the following routes starting from line 197:<br>`app.js`에서 197번째 줄부터 다음의 라우트를 추가해야 합니다:

|  #  | Method   | Path                      | 설명                | Controller actions   |
| :-: | -------- | ------------------------- | ------------------- | -------------------- |
|  1  | `GET`    | `/discussions`            | 모든 토론 목록      | index, indexView     |
|  2  | `GET`    | `/discussions/new`        | 새로운 토론 폼 보기 | new                  |
|  3  | `POST`   | `/discussions/create`     | 새로운 토론 생성    | create, redirectView |
|  4  | `GET`    | `/discussions/:id`        | 단일 토론 보기      | show, showView       |
|  5  | `GET`    | `/discussions/:id/edit`   | 토론 수정 폼 보기   | edit                 |
|  6  | `PUT`    | `/discussions/:id/update` | 토론 업데이트       | update, redirectView |
|  7  | `DELETE` | `/discussions/:id`        | 토론 삭제           | delete, redirectView |

### discussionsController.js

In the `discussionsController.js` file, you need to add the following actions. However, _SOME_ actions require a special line of code or two so that we can still add Comments. Any special code is shown below in the action's section:<br>`discussionsController.js` 파일에서 다음의 액션을 추가해야 합니다. 하지만, _일부_ 액션은 특별한 한 줄 또는 두 줄의 코드가 필요합니다. 이는 댓글을 추가할 수 있도록 하기 위함입니다. 특별한 코드는 아래의 액션 섹션에서 보여집니다:

1. `new` 액션
2. `create` 액션\*
3. `redirectView` 액션
4. `index` 액션\*
5. `indexView` 액션
6. `show` 액션\*
7. `showView` 액션
8. `edit` 액션\*
9. `update` 액션\*
10. `delete` 액션

#### \*create: 액션,

Use `let discussionParams = getDiscussionParams(req.body, req.user);` to get both the Discussion parameters and the User ID.<br>`let discussionParams = getDiscussionParams(req.body, req.user);`를 사용하여 토론 파라미터와 사용자 ID를 얻으세요.

```javascript
let discussionParams = getDiscussionParams(req.body, req.user);
```

Also, in the `create` action, **DO NOT** use `Discussion.register(...)` - rather use `Discussion.create(...)`. `register()` is for user registration using `passport`, `create()` is a Mongoose method for creating a new Object in the MongoDB database.<br>또한 `create` 작업에서 `Discussion.register(...)`를 **사용하지 마세요** - 오히려 `Discussion.create(...)`를 사용하세요. `register()`는 `passport`를 사용하여 사용자를 등록하기 위한 것이고, `create()`는 MongoDB 데이터베이스에 새 객체를 생성하기 위한 Mongoose 메서드입니다.

```javascript
// 폼 파라미터로 사용자 생성
  Discussion.create(discussionParams)
    .then((discussion) => {
      // res.locals.redirect = ...
      // res.locals.discussion = ...
      // next();
    })
    .catch((error) => {
      // console.log(...);
      // next(error);
    });
```

#### \*index: 액션,

After `Discussion.find()` but before `.then()`, add `.populate("author").exec()` so we can link Discussions with Users.<br>`Discussion.find()` 다음에 `.then()`을 추가하기 전에 `.populate("author").exec()`를 추가하여 토론과 사용자를 연결할 수 있도록 합니다.

```javascript
Discussion.find()
  .populate("author")
  .exec()
  .then((discussions) => {
    // ...
  });
```

#### \*show: 액션,

After `Discussion.findById(req.params.id)` but before `.then()`, add `.populate("author").populate("comments")` so we can link Discussions with Users and Comments. <br>`Discussion.findById(req.params.id)` 다음에 `.then()`을 추가하기 전에 `.populate("author").populate("comments")`를 추가하여 토론과 사용자, 댓글을 연결할 수 있도록 합니다.

Also, in `.then()`, increment `discussion.views++` and use `discussion.save()` to update the view count.<br>또한, `.then()`에서 `discussion.views++`를 증가시키고 `discussion.save()`를 사용하여 조회수를 업데이트하세요.

```javascript
Discussion.findById(req.params.id)
  .populate("author")
  .populate("comments")
  .then((discussion) => {
    discussion.views++;
    discussion.save();
    // ...
  });
```

#### \*edit: 액션,

After `Discussion.findById(req.params.id)` but before `.then()`, add `.populate("author").populate("comments")` so we can link Discussions with Users and Comments. <br>`Discussion.findById(req.params.id)` 다음에 `.then()`을 추가하기 전에 `.populate("author").populate("comments")`를 추가하여 토론과 사용자, 댓글을 연결할 수 있도록 합니다.

```javascript
Discussion.findById(req.params.id)
  .populate("author")
  .populate("comments")
  .then((discussion) => {
    // ...
  });
```

#### \*update: 액션,

Use `let discussionID = req.params.id;` and `let discussionParams = getDiscussionParams(req.body);` to get the Discussion parameters and ID. Then use `.populate("author")` before `.then()` to make sure the Discussion and User are linked.<br>`let discussionID = req.params.id;`와 `let discussionParams = getDiscussionParams(req.body);`를 사용하여 토론 파라미터와 ID를 얻으세요. 그런 다음 `.then()` 전에 `.populate("author")`를 사용하여 토론과 사용자가 연결되었는지 확인하세요.

```javascript
let discussionID = req.params.id,
  discussionParams = getDiscussionParams(req.body);

Discussion.findByIdAndUpdate(discussionID, {
  $set: discussionParams,
})
  .populate("author")
  .then((discussion) => {
    // ...
  });
```

### 실행

As a final step, rename your 2 files to remove the `.TODO` from their filenames, and try to run your program.<br>마지막 단계로, 2개의 파일의 이름에서 `.TODO`를 제거하고 프로그램을 실행해 보세요.

These are the things to check (what will be graded):<br>이것들을 확인하세요 (채점될 것입니다):

1. `/discussions` 페이지에서 토론 목록을 볼 수 있어야 합니다.
2. `/discussions/new` 페이지에서 새로운 토론을 만들 수 있어야 합니다.
3. 새로운 토론을 만들 수 있어야 합니다.
4. `/discussions/:id` 페이지에서 단일 토론을 볼 수 있어야 합니다.
5. `/discussions/:id/edit` 페이지에서 토론을 수정할 수 있어야 합니다.
6. 토론을 수정할 수 있어야 합니다.
7. 토론을 삭제할 수 있어야 합니다.

Just for fun, you can also try to add Comments to your Discussions. Do the Comments work?<br>재미로, 토론에 댓글을 추가해 보세요. 댓글이 작동하나요?

### Final Note

If there are any mistakes in the code from me, you will not be penalized for them. Just do your best to solve the problem.<br>제가 작성한 코드에 오류가 있다면, 이로 인해 벌점을 받지 않습니다. 문제를 해결하기 위해 최선을 다하세요.
