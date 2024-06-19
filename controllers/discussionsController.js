// controllers/discussionsController.js
"use strict";

const Discussion = require("../models/Discussion"), // 사용자 모델 요청
  getDiscussionParams = (body, user) => {
    return {
      title: body.title,
      description: body.description,
      author: user,
      category: body.category,
      tags: body.tags,
    };
  };

module.exports = {
  /**
   * =====================================================================
   * C: CREATE / 생성
   * =====================================================================
   */
  // 1. new: 액션,
  new: (req, res) => {
    res.render("discussions/new", {
      page: "new-discussion",
      title: "New Discussion",
    });
  },
  validate: (req, res, next) => {
    // 사용자가 입력한 이메일 주소가 유효한지 확인
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim(); // trim()으로 whitespace 제거
    req.check("email", "Email is invalid").isEmail();
    req.check("password", "Password cannot be empty").notEmpty(); // password 필드 유효성 체크

    // 사용자가 입력한 비밀번호가 일치하는지 확인
    req.getValidationResult().then((error) => {
      // 앞에서의 유효성 체크 결과 수집
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true; // skip 속성을 true로 설정
        req.flash("error", messages.join(" and ")); // 에러 플래시 메시지로 추가
        res.locals.redirect = "/discussions/new"; // new 뷰로 리디렉션 설정
        next();
      } else {
        next(); // 다음 미들웨어 함수 호출
      }
    });
  },
  // 2. create: 액션,
  create: (req, res, next) => {
    if (req.skip) next(); // 유효성 체크를 통과하지 못하면 다음 미들웨어 함수로 전달
      let discussionParams = getDiscussionParams(req.body, req.discussion); 
      // 폼 파라미터로 사용자 생성
      Discussion.create(discussionParams)
        .then((discussion) => {
          res.locals.redirect = "/discussions";
          res.locals.discussion ="/discussion";
          next();
        })
        .catch((error) => {
          console.log(`Failed to create user account because: ${error.message}.`);
          next(error);
        })
      },
    // let newDiscussion = new Discussion(getDiscussionParams(req.body)); // Listing 22.3 (p. 328)

    // Discussion.register(newDiscussion, req.body.password, (error, discussion) => {
    //   // 새로운 사용자 등록
    //   if (discussion) {
    //     // 새로운 사용자가 등록되면
    //     req.flash(
    //       "success",
    //       `${discussion.fullName}'s account created successfully!`
    //     ); // 플래시 메시지를 추가하고
    //     res.locals.redirect = "/discussions"; // 사용자 인덱스 페이지로 리디렉션
    //     next();
    //   } else {
    //     // 새로운 사용자가 등록되지 않으면
    //     req.flash(
    //       "error",
    //       `Failed to create user account because: ${error.message}.`
    //     ); // 에러 메시지를 추가하고
    //     res.locals.redirect = "/discussions/new"; // 사용자 생성 페이지로 리디렉션
    //     next();
    //   }
    // });

  // 3. redirectView: 액션,
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
    },
  
  /**
   * =====================================================================
   * R: READ / 조회
   * =====================================================================
   */
  /**
   * ------------------------------------
   * ALL records / 모든 레코드
   * ------------------------------------
   */
  // 4. index: 액션,
  index: (req, res, next) => {
    Discussion.find() // index 액션에서만 퀴리 실행
      .populate("author") // 사용자의 토론을 가져오기 위해 populate 메소드 사용
      .exec()
      .then((discussions) => {
        // 사용자 배열로 index 페이지 렌더링
        res.locals.discussions = discussions; // 응답상에서 사용자 데이터를 저장하고 다음 미들웨어 함수 호출
        next();
      })
      .catch((error) => {
        // 로그 메시지를 출력하고 홈페이지로 리디렉션
        console.log(`Error fetching discussions: ${error.message}`);
        next(error); // 에러를 캐치하고 다음 미들웨어로 전달
      });
  },
  // 5. indexView: 엑션,
  indexView: (req, res) => {
    res.render("discussions/index", {
      page: "discussions",
      title: "All Discussions",
    }); // 분리된 액션으로 뷰 렌더링
  },
  /**
   * ------------------------------------
   * SINGLE record / 단일 레코드
   * ------------------------------------
   */
  // 6. show: 액션,
  show: (req, res, next) => {
    let discussionId = req.params.id; // request params로부터 사용자 ID 수집
    Discussion.findById(discussionId) // ID로 사용자 찾기
      .populate("author")
      .populate("comments")
      .then((discussion) => {
        discussion.view++;
        discussion.save();
        res.locals.discussion = discussion; // 응답 객체를 통해 다음 믿들웨어 함수로 사용자 전달
        next();
      })
      .catch((error) => {
        console.log(`Error fetching discussion by ID: ${error.message}`);
        next(error); // 에러를 로깅하고 다음 함수로 전달
      });
  },
  // 7. showView: 액션,
  showView: (req, res) => {
    res.render("discussions/show", {
      page: "dscussions-details",
      title: "Dscussions Details",
    });
  },
  /**
   * =====================================================================
   * U: UPDATE / 수정
   * =====================================================================
   */
  // 8. edit: 액션,
  edit: (req, res, next) => {
    let discussionId = req.params.id;
    Discussion.findById(discussionId) // ID로 데이터베이스에서 사용자를 찾기 위한 findById 사용
      .populate("author")
      .populate("comments")
      .then((discussion) => {
        res.render("discussions/edit", {
          discussion: discussion,
          page: "edit-discussion",
          title: "Edit Discussion",
        }); // 데이터베이스에서 내 특정 사용자를 위한 편집 페이지 렌더링
      })
      .catch((error) => {
        console.log(`Error fetching disscusion by ID: ${error.message}`);
        next(error);
      });
  },
  // 9. update: 액션,
  update: (req, res, next) => {
    let discussionId = req.params.id,
      discussionParams = getDiscussionParams(req.body);

    Discussion.findByIdAndUpdate(discussionId, {
      $set: discussionParams,
    }) //ID로 사용자를 찾아 단일 명령으로 레코드를 수정하기 위한 findByIdAndUpdate의 사용
      .populate("author")
      .then((discussion) => {
        res.locals.redirect = `/discussions/${discussionId}`;
        res.locals.discussion = discussion;
        next(); // 지역 변수로서 응답하기 위해 사용자를 추가하고 다음 미들웨어 함수 호출
      })
      .catch((error) => {
        console.log(`Error updating discussion by ID: ${error.message}`);
        next(error);
      });
  },
  /**
   * =====================================================================
   * D: DELETE / 삭제
   * =====================================================================
   */
  // 10. delete: 액션,
  delete: (req, res, next) => {
    let discussionId = req.params.id;
    Discussion.findByIdAndRemove(discussionId) // findByIdAndRemove 메소드를 이용한 사용자 삭제
      .then(() => {
        res.locals.redirect = "/discussions";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting discussion by ID: ${error.message}`);
        next();
      });
  },
};