let noticeCardDiv = `<div
                    class="p-1 rounded-xl group sm:flex space-x-6 bg-gradient-to-br from-sky-100 to-white bg-opacity-50 shadow-xl hover:rounded-2xl">
                    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
    <lottie-player src="https://assets1.lottiefiles.com/packages/lf20_uaaroxwt.json" background="transparent" speed="1"
        style="width: 200px; height: 200px;" loop autoplay>
    </lottie-player>
    <div class="sm:w-7/12 pl-0 p-5">
        <div class="space-y-2">
            <div class="space-y-4">
                <h4 class="text-2xl font-semibold text-gray-900">$nTitle$</h4>
            </div>
            <a href="/pages/noticesInner.html?nId=$noticeId$" class="block w-max text-cyan-600">Read more</a>
        </div>
    </div>
    </div>`;

function loadNoticesPublic(htmlRowsDivId) {
    getNotices(function (res) {
        let noticesArray = res.data;
        let finalNoticesDivBody = "";
        for (let index = 0; index < noticesArray.length; index++) {
            const notice = noticesArray[index];
            console.log("status", notice.status);
            if (notice.status !== 1) {
                continue;
            }
            let noticeDivBody = noticeCardDiv.replace("$nTitle$", notice.title)
                .replace("$noticeId$", notice.id);
            finalNoticesDivBody += noticeDivBody;
        }
        document.getElementById(htmlRowsDivId).innerHTML = finalNoticesDivBody;
    })
}

let noticeFilePreviewTag = `<div class="relative flex items-end w-full bg-black h-60 group"> <a href="$FileSRC_2$" class="relative flex items-end w-full bg-black    h-60 group">
                <$TAG_TYPE$ src="$FileSRC$"
                    class="absolute inset-0 object-cover w-full h-full transition-opacity group-hover:opacity-90"></$TAG_TYPE_2$>

                <div
                    class="relative w-full p-3 tracking-widest text-center text-white transition-colors backdrop-blur-2xl group-hover:bg-black hover:text-sky-500">
                    <strong class="text-lg uppercase">
                        $FileName$
                    </strong>
                </div></a>
                $removeEle$
            </div>`;
function loadNoticeByIdPublic(noticeId, nTitleId, nDescriptionId, nFilesDiv, nFilePreviewDiv) {
    document.getElementById(nTitleId).innerHTML = "Loading...";
    document.getElementById(nDescriptionId).innerHTML = "";
    document.getElementById(nFilesDiv).innerHTML = "";
    document.getElementById(nFilePreviewDiv).innerHTML = "";
    getNoticeById(noticeId, function (res) {
        let noticeObj = res.data;
        document.getElementById(nTitleId).innerHTML = noticeObj.title;
        document.getElementById(nDescriptionId).innerHTML = noticeObj.description;
        if (!noticeObj.files) {
            noticeObj.files = [];
        }
        let finalNoticeFilesDivBody = "";
        let finalNoticeFilesPreviewDivBody = "";
        for (let index = 0; index < noticeObj.files.length; index++) {
            const noticeFileURL = noticeObj.files[index];
            // let fileEle = '<span id=eventSectionURL><a target="_blank" href="$FileURL$">$FileName$</a></span>';
            // let noticeDivBody = fileEle.replace("$FileURL$", noticeFileURL)
            //     .replace("$FileName$", "File " + (index + 1));
            // finalNoticeFilesDivBody += noticeDivBody + "<br><br>";
            let fileName = getFileNameFromPublicFileURL(noticeFileURL);
            let isImageFile = noticeObj.filesInfo[fileName].contentType.startsWith("image/");
            let noticeFilePreviewTagLocal = noticeFilePreviewTag.replace("$FileSRC$", noticeFileURL)
                .replace("$FileSRC_2$", noticeFileURL)
                .replace("$TAG_TYPE$", isImageFile ? "img" : "iframe")
                .replace("$TAG_TYPE_2$", isImageFile ? "img" : "iframe")
                .replace("$removeEle$", "")
                .replace("$FileName$", noticeObj.filesInfo[fileName].file.name);
            finalNoticeFilesPreviewDivBody += noticeFilePreviewTagLocal;
        }
        document.getElementById(nFilesDiv).innerHTML = finalNoticeFilesDivBody;
        document.getElementById(nFilePreviewDiv).innerHTML = finalNoticeFilesPreviewDivBody;
    }, function () {
        history.back();
    })
}
function getFileNameFromPublicFileURL(fileURL) {
    return fileURL.substring(fileURL.indexOf("/o/") + 3, fileURL.indexOf("?alt"));
}
//------------------------------------------------------------
const studentRowDivBody = `<tr>
                                <td class="border px-4 py-2">
                                    <a onclick="onViewStudentClicked('$studentIdView$')" class="bg-sky-800 cursor-pointer rounded p-1 mx-1 text-white">
                                        <i class="fas fa-eye"></i></a>
                                    <a onclick="onUpdateStudentClicked('$studentIdEdit$')" class="bg-sky-800 cursor-pointer rounded p-1 mx-1 text-white">
                                        <i class="fas fa-edit"></i></a>
                                    </a>
                                </td>
                                <td class="border px-4 py-2">$PartnerCode$</td>
                                <td class="border px-4 py-2">$EnrollmentNumber$</td>
                                <td class="border px-4 py-2">$SName$</td>
                                <td class="border px-4 py-2">$EnrollmentProgram$</td>
                                <td class="border px-4 py-2">$SCSession$</td>
                                <td class="border px-4 py-2">$SCSpecialization$</td>

                                <td class="border px-4 py-2">
                                    <button onclick="onStudentStatusChangeClicked('$studentIdStatus$')" class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white px-2 py-2 rounded-xl">$cStatus$</button>
                                </td>
                        </tr>`;

let students = {};
function loadStudents(htmlRowsDivId) {
    getStudents(function (res) {
        let studentsArray = res.data;
        let finalStudentsDivBody = "";
        for (let index = 0; index < studentsArray.length; index++) {
            const student = studentsArray[index];
            students[student.id] = student;
            let studentDivBody = studentRowDivBody.replace("$PartnerCode$", student.centerCode)
                .replace("$EnrollmentNumber$", student.enrollmentNumber)
                .replace("$EnrollmentProgram$", student.enrollProgramName)
                .replace("$RollNumber$", student.rollNumber)
                .replace("$SName$", student.name)
                .replace("$SCSession$", student.yearOfSession.replace("-", " to "))
                .replace("$cStatus$", student.statusText)
                .replace("$SCSpecialization$", student.specialization)
                .replace("$studentIdStatus$", student.id)
                .replace("$studentIdView$", student.id)
                .replace("$studentIdEdit$", student.id)
                .replace("$studentIdDelete$", student.id);
            finalStudentsDivBody += studentDivBody;
        }
        document.getElementById(htmlRowsDivId).innerHTML = finalStudentsDivBody;
    })
}

function onStudentStatusChangeClicked(studentId) {
    selectedStudentId = studentId;
    showStatusChangePopUp();
}

function onViewStudentClicked(studentId) {
    selectedStudentId = studentId;
    window.location.href = "/dev/admin-studentInner.html?id=" + selectedStudentId + "&action=view";
}

function onUpdateStudentClicked(studentId) {
    selectedStudentId = studentId;
    window.location.href = "/dev/admin-studentInner.html?id=" + selectedStudentId;
}

let selectedStudentId;
function onDeleteStudentClicked(studentId) {
    selectedStudentId = studentId;
    showDeletePopUp();
}
//------------------------------------------------------
//------------------------------------------------------------
const centerRowDivBody = `<tr>
                                <td class="border px-4 py-2">
                                    <a onclick="onViewCenterClicked('$centerIdView$')" class="bg-sky-800 cursor-pointer rounded p-1 mx-1 text-white">
                                        <i class="fas fa-eye"></i></a>
                                    <a onclick="onUpdateCenterClicked('$centerIdEdit$')" class="bg-sky-800 cursor-pointer rounded p-1 mx-1 text-white">
                                        <i class="fas fa-edit"></i></a>
                                    </a>
                                </td>
                                <td class="border px-4 py-2">$CenterCode$</td>
                                <td class="border px-4 py-2">$CName$</td>
                                <td class="border px-4 py-2">$CType$</td>
                                <td class="border px-4 py-2">$StateCountry$</td>

                                <td class="border px-4 py-2">
                                    <button onclick="onCenterStatusChangeClicked('$centerIdStatus$')" class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white px-2 py-2 rounded-xl">$cStatus$</button>
                                </td>
                        </tr>`;

let centers = {};
function loadCenters(htmlRowsDivId) {
    getCenters(function (res) {
        let centerssArray = res.data;
        let finalCentersDivBody = "";
        for (let index = 0; index < centerssArray.length; index++) {
            const center = centerssArray[index];
            centers[center.id] = center;
            let centerDivBody = centerRowDivBody.replace("$CenterCode$", center.code)
                .replace("$CName$", center.name)
                .replace("$CType$", center.type)
                .replace("$StateCountry$", center.state + ", " + center.country)
                .replace("$cStatus$", center.statusText)
                .replace("$centerIdStatus$", center.id)
                .replace("$centerIdView$", center.id)
                .replace("$centerIdEdit$", center.id)
                .replace("$centerIdDelete$", center.id);
            finalCentersDivBody += centerDivBody;
        }
        document.getElementById(htmlRowsDivId).innerHTML = finalCentersDivBody;
    })
}

function onCenterStatusChangeClicked(centerId) {
    selectedCenterId = centerId;
    showStatusChangePopUp();
}

function onViewCenterClicked(centerId) {
    selectedCenterId = centerId;
    window.location.href = "/dev/admin-centerInner.html?id=" + selectedCenterId + "&action=view";
}

function onUpdateCenterClicked(centerId) {
    selectedCenterId = centerId;
    window.location.href = "/dev/admin-centerInner.html?id=" + selectedCenterId;
}

let selectedCenterId;
function onDeleteCenterClicked(centerId) {
    selectedCenterId = centerId;
    showDeletePopUp();
}
//------------------------------------------------------
//------------------------------------------------------------
const courseRowDivBody = `<tr>
                            <td class="border px-4 py-2">
                                <a onclick="onViewCourseClicked('$courseIdView$')" class="bg-sky-800 cursor-pointer rounded p-1 mx-1 text-white">
                                    <i class="fas fa-eye"></i></a>
                                <a onclick="onUpdateCourseClicked('$courseIdEdit$')" class="bg-sky-800 cursor-pointer rounded p-1 mx-1 text-white">
                                    <i class="fas fa-edit"></i></a>
                                </a>
                            </td>
                            <td class="border px-4 py-2">$cName$</td>
                            <td class="border px-4 py-2">$Category$</td>
                            <td class="border px-4 py-2">$cLevel$</td>
                            <td class="border px-4 py-2">$cPattern$</td>

                            <td class="border px-4 py-2">
                                <button onclick="onCourseStatusChangeClicked('$courseIdStatus$')" class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white px-2 py-2 rounded-xl">$cStatus$</button>
                            </td>
                        </tr>`;

function resIsValid(res) {
    try {
        if (res || typeof res === 'string') {
            res = JSON.parse(res);
            return true;
        }
    } catch (e) {
        console.error("error", e);
    }
    return false;
}

let courses = {};
function loadCourses(htmlRowsDivId) {
    getCourses(function (res) {
        let coursesArray = res.data;
        let finalCoursesDivBody = "";
        for (let index = 0; index < coursesArray.length; index++) {
            const course = coursesArray[index];
            courses[course.id] = course;
            let courseDivBody = courseRowDivBody.replace("$cName$", course.title)
                .replace("$Category$", course.category)
                .replace("$cLevel$", course.level)
                .replace("$cPattern$", course.pattern)
                .replace("$cStatus$", course.statusText)
                .replace("$courseIdStatus$", course.id)
                .replace("$courseIdView$", course.id)
                .replace("$courseIdEdit$", course.id)
                .replace("$courseIdDelete$", course.id);
            finalCoursesDivBody += courseDivBody;
        }
        document.getElementById(htmlRowsDivId).innerHTML = finalCoursesDivBody;
    })
}

function onCourseStatusChangeClicked(courseId) {
    selectedCourseId = courseId;
    showStatusChangePopUp();
}

function onViewCourseClicked(courseId) {
    selectedCourseId = courseId;
    window.location.href = "/dev/admin-coursesInner.html?id=" + selectedCourseId + "&action=view";
}

function onUpdateCourseClicked(courseId) {
    selectedCourseId = courseId;
    window.location.href = "/dev/admin-coursesInner.html?id=" + selectedCourseId;
}

let selectedCourseId;
function onDeleteCourseClicked(courseId) {
    selectedCourseId = courseId;
    showDeletePopUp();
}
//------------------------------------------------------

function createCourse(reqBody, onSuccess, onError) {
    let url = getBaseURL() + "/course";
    //let headers = getAdminHeaders("FormData");
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "POST", reqBody, headers)//, "FormData"
}

function createCenter(reqBody, onSuccess, onError) {
    let url = getBaseURL() + "/center";
    //let headers = getAdminHeaders("FormData");
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "POST", reqBody, headers)//, "FormData"
}

function createStudent(reqBody, onSuccess, onError) {
    let url = getBaseURL() + "/student";
    let headers = getAdminHeaders("FormData");
    // let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "POST", reqBody, headers, "FormData")
}

function getCourseById(courseId, onSuccess, onError) {
    let url = getBaseURL() + "/course/" + courseId + "?fieldsAll=1";
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "GET", null, headers)
}

function getCenterById(centerId, onSuccess, onError) {
    let url = getBaseURL() + "/center/" + centerId + "?fieldsAll=1";
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "GET", null, headers)
}

function getStudentById(studentId, onSuccess, onError) {
    let url = getBaseURL() + "/student/" + studentId + "?fieldsAll=1";
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "GET", null, headers)
}

function deleteCourseById(courseId, onSuccess, onError) {
    let url = getBaseURL() + "/course/" + courseId;
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "DELETE", null, headers)
}

function deleteCenterById(centerId, onSuccess, onError) {
    let url = getBaseURL() + "/center/" + centerId;
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "DELETE", null, headers)
}

function deleteStudentById(studentId, onSuccess, onError) {
    let url = getBaseURL() + "/student/" + studentId;
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "DELETE", null, headers)
}

function hideBtn(btnId) {
    let button = document.getElementById(btnId);
    button.style.display = "none";
}

function disableBtn(btnId, btnText) {
    let button = document.getElementById(btnId);
    button.disabled = true;
    if (btnText) {
        button.innerHTML = btnText;
    }
}

function enableBtn(btnId, btnText) {
    let button = document.getElementById(btnId);
    button.disabled = false;
    if (btnText) {
        button.innerHTML = btnText;
    }
}

function serialize(nodeType, dataObj) {
    if (!nodeType || typeof nodeType !== "string") {
        nodeType = 'input';
    }
    var elements = document.querySelectorAll('#paperSubmitForm ' + nodeType);
    var data = {};
    if (dataObj && isObject(dataObj)) {
        data = dataObj;
    }
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        console.log("element", el.nodeName);
        var val = el.value;
        if (!val) val = "";
        var fullName = el.getAttribute("name");
        if (!fullName) continue;
        var fullNameParts = fullName.split('.');
        var prefix = '';
        var stack = data;
        for (var k = 0; k < fullNameParts.length - 1; k++) {
            prefix = fullNameParts[k];
            if (!stack[prefix]) {
                stack[prefix] = {};
            }
            stack = stack[prefix];
        }
        prefix = fullNameParts[fullNameParts.length - 1];
        if (stack[prefix]) {

            var newVal = stack[prefix] + ',' + val;
            stack[prefix] += newVal;
        } else {
            stack[prefix] = val;
        }
    }
    // console.log(data);
    return data;
}

function updateCourse(reqBody, onSuccess, onError) {
    let url = getBaseURL() + "/course";
    //let headers = getAdminHeaders("FormData");
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "PATCH", reqBody, headers)//, "FormData"
}

function updateCenter(reqBody, onSuccess, onError) {
    let url = getBaseURL() + "/center";
    //let headers = getAdminHeaders("FormData");
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "PATCH", reqBody, headers)//, "FormData"
}

function updateStudent(reqBody, onSuccess, onError) {
    let url = getBaseURL() + "/student";
    let headers = getAdminHeaders("FormData");
    // let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "PATCH", reqBody, headers, "FormData")
}

function updateCourseStatus(courseId, reqBody, onSuccess, onError) {
    let url = getBaseURL() + "/course/status/" + courseId;
    //let headers = getAdminHeaders("FormData");
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "PATCH", reqBody, headers)//, "FormData"
}

function updateCenterStatus(centerId, reqBody, onSuccess, onError) {
    let url = getBaseURL() + "/center/status/" + centerId;
    //let headers = getAdminHeaders("FormData");
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "PATCH", reqBody, headers)//, "FormData"
}

function updateStudentStatus(studentId, reqBody, onSuccess, onError) {
    let url = getBaseURL() + "/student/status/" + studentId;
    //let headers = getAdminHeaders("FormData");
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "PATCH", reqBody, headers)//, "FormData"
}

function asi(onSuccess, onError) {
    let url = getBaseURL() + "/admin/signin";
    let headers = getAdminHeaders(false, true);
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                alert(err);
            } else {
                alert(err);
            }
        } else {
            // console.log("success res", JSON.stringify(response));
            localStorage["aun"] = response.data.loginId;
            localStorage["alt"] = response.data.loginSession;
            localStorage["altime"] = new Date().getTime();
            // console.log("aun", localStorage["aun"]);
            // console.log("alt", localStorage["alt"]);
            // console.log("altime", localStorage["altime"]);
            onSuccess(response);
        }
    }, "PATCH", {}, headers)
}

function getCustomerHeaders(isFormData, isAdmin) {
    let headers = [{
        key: 'x-api-key',
        value: 'DEV_hIo3cNcgvjjgvvjgvjjvhgghvhhjvjbvbvkbsuWxCupsADArl7Abx1gzpUxEL_DEV'
    },
    {
        key: 'x-login-session-id',
        value: 'hIo3cNd4Z17VTSJyHGDH5FNCQoIuYDdMhRQwoOdsuWxCupsADArl7Abx1gzpUxEL-JournalEasy@123'
    }];
    if (!isAdmin) {
        headers.push({
            key: 'x-client',
            value: 'WEB_CHROME_CUSTOMER_DEV_1.0_installerPackageName_true'
        });
    }
    if (!isFormData) {
        headers.push({
            key: 'Content-Type',
            value: 'application/json'
        });
    }
    return headers;
}

let ap;
function getAdminHeaders(isFormData, isSignIn) {
    let headers = getCustomerHeaders(isFormData, true);
    headers.push({
        key: 'x-admin-id',
        value: localStorage.getItem("aun") + ''
    });
    headers.push({
        key: 'x-client',
        value: 'WEB_CHROME_ADMIN_DEV_1.0_installerPackageName_true'
    });
    if (isSignIn) {
        headers.push({
            key: 'x-admin-password',
            value: ap + ''
        });
    } else {
        let altMillis = localStorage.getItem("altime") || 0;
        let diff = (new Date().getTime() - altMillis);
        if (diff > 30 * 60 * 1000) {//30 minutes
            localStorage["aun"] = "";
            localStorage["alt"] = "";
        }
        headers.push({
            key: 'x-admin-token',
            value: localStorage.getItem("aun") + localStorage.getItem("alt") + '' + localStorage.getItem("aun")
        });
    }
    return headers;
}

function getBaseURL() {
    return "https://us-central1-kennedy-university-saint-lucia.cloudfunctions.net/studentverify/api/v1"
}

function getCourses(onSuccess, onError, hideAlert) {
    let url = getBaseURL() + "/courses";
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                if (!hideAlert) {
                    alert(err);
                }
            } else {
                if (!hideAlert) {
                    alert(err);
                }
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "GET", false, headers)
}

function getCenters(onSuccess, onError, hideAlert) {
    let url = getBaseURL() + "/centers";
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                if (!hideAlert) {
                    alert(err);
                }
            } else {
                if (!hideAlert) {
                    alert(err);
                }
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "GET", false, headers)
}

function getCenterByCode(centerCode, onSuccess, onError, hideAlert) {
    let url = getBaseURL() + "/centers?code=" + centerCode;
    let headers = getCustomerHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                if (!hideAlert) {
                    alert(err);
                }
            } else {
                if (!hideAlert) {
                    alert(err);
                }
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "GET", false, headers)
}

function getStudents(onSuccess, onError, hideAlert) {
    let url = getBaseURL() + "/students";
    let headers = getAdminHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                if (!hideAlert) {
                    alert(err);
                }
            } else {
                if (!hideAlert) {
                    alert(err);
                }
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "GET", false, headers)
}

function getStudentByEnrollmentNumberAndCenterCode(enrollmentNumber, centerCode, onSuccess, onError, hideAlert) {
    let url = getBaseURL() + "/students?enrollmentNumber=" + enrollmentNumber + "&centerCode=" + centerCode + "&fieldsAll=1";
    let headers = getCustomerHeaders();
    callAPI(url, function (err, response) {
        if (err) {
            if (onError) {
                onError();
            }
            if (response) {
                console.error("error res", JSON.stringify(response));
                if (!hideAlert) {
                    alert(err);
                }
            } else {
                if (!hideAlert) {
                    alert(err);
                }
            }
        } else {
            //console.log("success res", JSON.stringify(response));
            //localStorage["logRes"] = JSON.stringify(response);
            onSuccess(response);
        }
    }, "GET", false, headers)
}

function callAPI(url, callback, requestMethod, requestBody, headers, isFormData) {
    var xhr = new XMLHttpRequest();
    xhr.open(requestMethod, url);
    // console.log("xhr.status");
    // console.log("headers", headers);
    if (headers && headers.length > 0) {
        for (let index = 0; index < headers.length; index++) {
            const header = headers[index];
            xhr.setRequestHeader(header.key, header.value);
        }
    } else {
        xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.onreadystatechange = function () {
        let err = false;
        if (xhr.readyState === 4) {
            // console.log(xhr.status);
            // console.log(xhr.responseText);
            if (xhr.status >= 200 && xhr.status <= 299) {
                /*try {
                    console.log(xhr.status, JSON.stringify(xhr.response), JSON.stringify(xhr.responseText));
                } catch (e) {
                    console.log("e console", JSON.stringify(e));
                }*/
                var response = JSON.parse(xhr.responseText);
                if ((response.code + '').startsWith('2')) {
                    //Success
                    callback(err, response);
                } else {
                    err = "Server error";
                    //logic/validation failure
                    if (response) {
                        if (response.message) {
                            err = response.message;
                        }
                        callback(err, response);
                    } else {
                        callback(err);
                    }
                }
            } else {
                var response = JSON.parse(xhr.responseText);
                //Network/Server failure
                err = "Network error";
                if (response) {
                    if (response.message) {
                        err = response.message;
                    }
                    if (!(url + '').endsWith("/signin") && (response.code + '').startsWith("48")) {
                        //Admin authentication error code
                        alert("Invalid session, Please sign in.")
                        window.location.href = "/dev/admin-login.html";
                        return;
                    }
                    callback(err, response);
                } else {
                    callback(err);
                }
            }
        }
    };
    if (requestBody) {
        xhr.send(isFormData ? requestBody : JSON.stringify(requestBody));
        // xhr.send(requestBody);
    } else {
        xhr.send();
    }
}