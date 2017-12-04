webpackHotUpdate(0,{

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)('.diagnosisWaitings').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '2'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        // console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                    <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                    <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                    <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)('.ui.longer.modal.waitingPatientList').modal('show');
    (0, _jquery2.default)(".completeTab").removeClass("active");
    (0, _jquery2.default)(".waitingTab").addClass("active");
});

(0, _jquery2.default)('.waitingTab').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '2'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)(".completeTab").removeClass("active");
    (0, _jquery2.default)(".waitingTab").addClass("active");
});

(0, _jquery2.default)('.completeTab').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '1'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)(".waitingTab").removeClass("active");
    (0, _jquery2.default)(".completeTab").addClass("active");
});

(0, _jquery2.default)('#doctorSignedComplete').on('click', function () {

    var prescriptionLength = (0, _jquery2.default)('#prescriptionTableBody').children().length - 1;
    var prescription = [];
    var medicine = {};

    for (var i = 1; i <= prescriptionLength; i++) {
        medicine = {};
        medicine.medicine_id = (0, _jquery2.default)('#prescriptionTableBody').children().eq(i).attr('id');
        medicine.chartNumber = (0, _jquery2.default)('#preChartId').val();
        medicine.medicineName = _jquery2.default.trim((0, _jquery2.default)('#prescriptionTableBody').children().eq(i).children().eq(0).text());
        medicine.medicineIngredient = _jquery2.default.trim((0, _jquery2.default)('#prescriptionTableBody').children().eq(i).children().eq(1).text());
        medicine.doses = (0, _jquery2.default)('#prescriptionTableBody').children().eq(i).children().eq(2).children().val();
        medicine.dosesCountByDay = (0, _jquery2.default)('#prescriptionTableBody').children().eq(i).children().eq(3).children().val();
        medicine.dosesDay = (0, _jquery2.default)('#prescriptionTableBody').children().eq(i).children().eq(4).children().val();
        medicine.remarks = (0, _jquery2.default)('#prescriptionTableBody').children().eq(i).children().eq(5).children().val();
        prescription.push(medicine);
    }

    var param = {
        chartNumber: (0, _jquery2.default)('#preChartId').val(),
        impression: (0, _jquery2.default)('.impression').val().replace(/\n/g, "<br>"),
        presentIllness: (0, _jquery2.default)('.presentIllness').val().replace(/\n/g, "<br>"),
        treatmentNote: (0, _jquery2.default)('.treatmentNote').val().replace(/\n/g, "<br>"),
        updateStatus: 3,
        prescription: JSON.stringify(prescription)
    };

    _jquery2.default.ajax({
        type: 'POST',
        url: 'http://localhost:3000/chart/update',
        data: param,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        if (result[0] === 1) {

            (0, _jquery2.default)('.preChartId').val('');
            (0, _jquery2.default)('.preName').val('');
            (0, _jquery2.default)('.impression').val('');
            (0, _jquery2.default)('.presentIllness').val('');
            (0, _jquery2.default)('.treatmentNote').val('');

            if ((0, _jquery2.default)('#prescriptionTableBody').children().length > 0) {
                (0, _jquery2.default)('#prescriptionTableBody *').remove();
            }

            (0, _jquery2.default)('#pastDiagnosisRecord').attr('disabled', true);
            (0, _jquery2.default)('#vitalSign').attr('disabled', true);
            (0, _jquery2.default)('#pharmacopoeia').attr('disabled', true);

            _jquery2.default.uiAlert({
                textHead: '[알림]',
                text: '차트번호 ' + param.chartNumber + ' 본진 서명 완료되었습니다.',
                bgcolor: '#19c3aa',
                textcolor: '#fff',
                position: 'top-left',
                time: 2
            });
        } else {
            alert('[System Error]\n IT 본부 단원에게 문의해주세요.');
        }
    });
});

/***/ })

})