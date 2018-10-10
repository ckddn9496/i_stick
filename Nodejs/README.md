# i_stick
2018_2학기 캡스톤 프로젝트 i stick

I Stick Server Notification using Nodejs

<h1>Routing</h1>
/*  Login */
- activity_login.xml  MainAcivity.java : Completed
/login  :   로그인 화면
login이 완료되면 putExtra 로 no, id 전송

/*  Regist  */
- activity_register.xml RegistActivity.java : Completed
/register   :   회원가입
/check/id   :   ID 중복 체크

/*  User  */
- activity_user.xml UserActivity : yet
/user   :   user 로그인 화면
/user/navigate    :   길찾기 모드

/*  Parent  */
- activity_parent.xml ParentActiviy.java : Completed
getExtra : no, id 받기
/parent :   parent 로그인 화면 userList 얻어와서 화면 설정

- activiy_edit_parent_info.xml  EditParentInfo.java : Completed
/parent/edit  : 내 정보 수정

- activity_parent_menu.xml ParentMenu.java : yet
/parent/menu/id

- 담당 user추가 dialog : user id, pw입력하여 등록 : yet
/parent/regist