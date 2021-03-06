
/**
 * Defendencies
 */
import $ from 'jquery';
import _ from 'lodash';
import { bb } from "billboard.js";
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import diagnosis from './pastDiagnosisList';
import moment from 'moment';
import 'jquery-validation';

/**
 * init
 */
function init() {

    if (!_.eq(location.pathname, '/originalDiagnosis')) return;
    showAndHide('main-hide-and-show-row', 'diagnosis-container');
}
/**
 *
 * @param {string} newId
 * @description
 * tmeplate originalDiagnosis.ejs class main-hide-and-show-row 중
 * 보여주고 있는것은 숨기고 새로운 것을 보여줌
 * default class     main-hide-and-show-row
 * default id           diagosis
 */
const showAndHide = (rowsClass, newId) => {
    //현재 목록 가져온 후 보여주고 있는 row 찾기
    const rows = $(`.${rowsClass}`);
    const findRow = _.find(rows, row => $(row).is(':visible'));
    const { id: findId = "" } = findRow;
    // 다를 경우만 변화
    if (!_.eq(findId, newId)) {
        $(`.${rowsClass}`).hide()
        $(`#${newId}`).show()
    }
}

//validation
/**
*Impression, Present illness / Medication,  Treatment note / Medication -> 300자 이내
*
*/
function validateHandler (errorMap, errorList){
    if(this.numberOfInvalids()) {
        $.uiAlert({
            textHead: '[경고]',
            text: errorList[0].message,
            bgcolor: '#FF5A5A',
            textcolor: '#fff',
            position: 'top-center',
            time: 2
        });
        errorList[0].element.focus();
    }
}

//본진 정보
$('#diagonosisChartForm').validate({
  onkeyup: false,
  rules: {
    impression: {
      maxlength:300
    },
    presentIllness: {
      maxlength:300
    }
  },
  messages:{
    impression:{
      maxlength: "impression은 최대 {0}자 까지 입력 가능 합니다."
    },
    presentIllness:{
      maxlength: "Present illness / Medication은 최대 {0}자까지 입력 가능합니다."
    }
  },
  showErrors: validateHandler
});

$('#Treatmentform').validate({
  onkeyup: false,
  rules:{
    treatmentNote:{
      maxlength: 300
    }
  },
  messages:{
    treatmentNote:{
      maxlength: "Treatment note는 최대 {0}자까지 입력 가능합니다."
    }
  },
  showErrors: validateHandler
});

//약전 validation
$('#prescriptionForm').validate({
  onkeyup : false,
  rules: {
    currentDoses:{
      required: true,
      digits: true,
      min: 1
    },
    currentDosesDay:{
      required: true,
      digits: true,
      min: 1
    },
    currentRemarks:{
      maxlength: 100
    }
  },
  messages: {
    currentDoses: {
      required: "1회 투약량을 입력해주세요!",
      digits: "1회 투약량은 1이상의 정수만 입력 가능합니다.",
      min: "1회 투약량은 1이상의 정수만 입력 가능합니다."
    },
    currentDosesDay: {
      required: "복용 일수를 입력해주세요!",
      digits: "복용 일수는 1이상의 정수만 입력 가능합니다.",
      min: "복용 일수는 1이상의 정수만 입력 가능합니다."
    },
    currentRemarks:{
      maxlength: "비고란은 최대 {0}자까지 입력 가능합니다."
    }
  },
  showErrors:validateHandler
});


$('.diagnosisWaitings').on('click', () => {

    if ($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status: '2',
    };

    $.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        const { data, code } = result;
        if (!_.eq(code, resultCode.success)) {
            return Promise.reject(`get fail waiting list data ${data.error}`);
        }

    }).then((result) => {

      const { data } = result;
      for(let i = 0; i < data.length; i++) {
          $('#tableBody').append(
              `<tr id=${data[i].chartNumber} class="diagnosis-table-content">
                     <td id=${data[i].chartNumber}>${data[i].chartNumber}</td>
                     <td id=${data[i].chartNumber}>${data[i].name}</td>
                     <td id=${data[i].chartNumber}>${data[i].birth}</td>
              </tr>`
          )}
    }).catch(error => console.log(error));

    $('.ui.longer.modal.waitingPatientList').modal('show');
    $(".completeTab").removeClass("active");
    $(".waitingTab").addClass("active");
});

$('.waitingTab').on('click', () => {
    if ($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status: '2',
    };

    $.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        const { data, code } = result;
        if (!_.eq(code, resultCode.success)) {
            return Promise.reject(`get fail waiting list data ${data.error}`);
        }

    }).then((result) => {

      const { data } = result;
      for(let i = 0; i < data.length; i++) {
          $('#tableBody').append(
              `<tr id=${data[i].chartNumber} class="diagnosis-table-content">
                     <td id=${data[i].chartNumber}>${data[i].chartNumber}</td>
                     <td id=${data[i].chartNumber}>${data[i].name}</td>
                     <td id=${data[i].chartNumber}>${data[i].birth}</td>
              </tr>`
          )}
    }).catch(error => console.log(error));

    $(".completeTab").removeClass("active");
    $(".waitingTab").addClass("active");
});

$('.completeTab').on('click', () => {

    if ($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status: '7',
    };

    $.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        for (let i = 0; i < result.length; i++) {

            const { code, data } = result;

            if (!_.eq(code, resultCode.success)) {
                return Promise.reject(`fail get complete paitents ${data.error}`);
            }
            return Promise.resolve(data);
            // $('#tableBody').append(
            //     `<tr id=${result[i].chartNumber} class="diagnosis-table-content">
            //            <td id=${result[i].chartNumber}>${result[i].chartNumber}</td>
            //            <td id=${result[i].chartNumber}>${result[i].name}</td>
            //            <td id=${result[i].chartNumber}>${result[i].birth}</td>
            //     </tr>`
            //
            // )
        }
    })
    .then(result => {
      const { data } = result;
      $('#tableBody').append(
          _.map(data, row => {
            const { chartNumber, name, birth } = row;
            return `<tr id="${chartNumber}" flag="complete" class="diagnosis-table-content">
                        <td id=${chartNumber} flag="complete">${chartNumber}</td>
                        <td id=${chartNumber} flag="complete">${name}</td>
                        <td id=${chartNumber} flag="complete">${birth}</td>
                 </tr>`
          })
      );
    })
    .catch(error => console.log(error))

    $(".waitingTab").removeClass("active");
    $(".completeTab").addClass("active");
});

$(document).on('click', '.diagnosis-table-content', (e) => {

    if ($('#originalDiagnosisCCsegment').children().length)
        $('#originalDiagnosisCCsegment *').remove();
    // 현재 화면에 렌더링 되어있던 CC rows 전체 삭제

    const completeFlag = $(e.target).attr('flag')

    $('.impression').val('');
    $('.presentIllness').val('');
    $('.treatmentNote').val('');
    $('#prescription-table-body').empty().append(
      `<tr>
        <td class="defaultPrescriptionTableBody" style="text-align:center;" colspan="7">조제를 시작할 환자를 선택해주세요.</td>
      </tr>`
    );

    const docs = {
        chartNumber: e.target.id,
        complaintsKey: e.target.id
    };

    $.ajax({
        type: 'GET',
        url: '/chart',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        diagnosis
          .getPastChartList(result.patient_id)

        $('#preChartId').val(result.chartNumber);
        $('#preName').val(result.patient.name);
        $('#originChartId').val(result.chartNumber);
        $('#originName').val(result.patient.name);
        // 차트 번호, 이름 화면 렌더링

        $('#heartRate').val(result.heartRate);
        $('#pulseRate').val(result.pulseRate);
        $('#bodyTemporature').val(result.bodyTemporature);
        $('#systoleBloodPressure').val(result.systoleBloodPressure);
        $('#diastoleBloodPressure').val(result.diastoleBloodPressure);
        $('#bloodGlucose').val(result.bloodGlucose);
        $('#originName').val(result.patient.name);
        $('#mealTerm').val(result.mealTerm + '시간');
        // 예진 정보 화면 렌더링

        for (var i in result.complaints) {

            $('#originalDiagnosisCCsegment').append(
                ` <div class="inner-div" style="border-color: #ddd;">
                  <div class="sixteen wide column">
                          <div class="ui fluid input focus">
                              <input type="text" placeholder="C.C" value="${result.complaints[i].chiefComplaint}" />
                          </div>

                          <div class="ui form" style="margin-top: 1%">
                              <div class="field">
                                  <textarea rows="3" placeholder="History of C.C">${result.complaints[i].chiefComplaintHistory}</textarea>
                              </div>
                          </div>
                      </div>
                  </div>`
            );
            // CC 갯수에 따라 화면 렌더링
        }

        $('#name').val(result.patient.name);
        $('#gender').val(result.patient.gender);
        $('#birth').val(result.patient.birth.slice(0, 10));
        $('#height').val(result.patient.height + 'cm');
        $('#weight').val(result.patient.weight + 'kg');
        $('#bmi').val(result.patient.BMI);
        $('#smoking').val(result.patient.smokingAmount);
        $('#smokingPeriod').val(result.patient.smokingPeriod);
        $('#drinking').val(result.patient.drinkingAmount);
        $('#drinkingPeriod').val(result.patient.drinkingPeriod);

        let idx = 1; /* 과거력 조회용 인덱스 */

        for (let i of result.patient.histories[0].pastHistory) {
            let id = '#disease'+idx;
            if(i == 1) {
                $(id).prop("checked", true);
            }
            idx++;
        }

        idx = 1;

        for (let i of result.patient.histories[0].allergy) {
            let id = '#allergy'+idx;
            if(i == 1) {
                $(id).prop("checked", true);
            }
            idx++;
        }

        let value = result.patient.histories[0].pastMedical;

        $('input[name="pastMedical"][value=' + value + ']').prop('checked', true).trigger("change");
        $('#pastMedicalTime').val(result.patient.histories[0].pastMedicalTime);
        $('#pastMedicalArea').val(result.patient.histories[0].pastMedicalArea);

        value = result.patient.histories[0].pastMedication;

        $('input[name="pastMedication"][value=' + value + ']').prop('checked', true).trigger("change");
        $('#pastMedicationPeriod').val(result.patient.histories[0].pastMedicationPeriod);
        $('#pastMedicationType').val(result.patient.histories[0].pastMedicationType);
        $('#diseaseDescription').val(result.patient.histories[0].pastHistoryComment);
        $('#allergyDescription').val(result.patient.histories[0].allergyComment)

        if(completeFlag) renderCompleteChart(result)
    })

    $('#doctorSignedComplete').attr('disabled', false);
    $('#vitalSign').attr('disabled', false);
    $('#pharmacopoeia').attr('disabled', false);
    $('#pastDiagnosisRecord').attr('disabled', false);
    $('#diagonosis').attr('disabled', false);
    $('#preDiagonosis').attr('disabled', false);
    $('#patientInfo').attr('disabled', false);
    $('.ui.longer.modal').modal('hide');
});

function renderCompleteChart(data) {

  http
      .getMethod(`/prescription/${data.chartNumber}`)
      .then(result => {
          const { data, code } = result;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject(`get fail prescriptions data ${data.error}`);
          }
          return Promise.resolve(data);
      })
      .then(data => {

        if ($('#prescription-table-body .defaultPrescriptionTableBody').length)
          $('#prescription-table-body .defaultPrescriptionTableBody').remove();
        $('#prescription-table-body').empty();
        $('#prescription-table-body').append(`<tr></tr>`);

        $('#prescription-table-body').append(
            _.map(data.prescriptions, data => {
              const { id, medicineName, medicineIngredient, doses, dosesCountByDay, dosesDay, remarks } = data;
              return ` <tr prescription-id="${id}" class="ui fluid">
                <td>${medicineName}</td>
                <td>${medicineIngredient}</td>
                <td>${doses}</td>
                <td>${dosesCountByDay}</td>
                <td>${dosesDay}</td>
                <td>${remarks === '' ? '-' : remarks}</td>
                <td>-</td>
              </tr>`
            })
        );
      })
      .catch(error => console.log(error))

  $('.impression').val(data.impression);
  $('.presentIllness').val(data.presentIllness);
  $('.treatmentNote').val(data.treatmentNote);
  $('#doctorSignedComplete').attr('disabled', true);
  $('#pharmacopoeia').attr('disabled', true);
}

$(document).on('click', '#doctorSignedComplete', (e) => {
    if(!$('#diagonosisChartForm').valid() || !$('#Treatmentform').valid() || !$('#prescriptionForm').valid()) return;


    var prescriptionLength = $('#prescription-table-body').children().length - 1;
    var prescription = [];
    var medicine = {};

    for (var i = 1; i <= prescriptionLength; i++) {
        medicine = {};
        medicine.medicine_id = $('#prescription-table-body').children().eq(i).attr('id');
        medicine.chartNumber = $('#preChartId').val();
        medicine.medicineName = $.trim($('#prescription-table-body').children().eq(i).children().eq(0).text());
        medicine.medicineIngredient = $.trim($('#prescription-table-body').children().eq(i).children().eq(1).text());
        medicine.doses = $('#prescription-table-body').children().eq(i).children().eq(2).children().val();
        medicine.dosesCountByDay = $('#prescription-table-body').children().eq(i).children().eq(3).children().children().val();
        medicine.dosesDay = $('#prescription-table-body').children().eq(i).children().eq(4).children().val();
        medicine.remarks = $('#prescription-table-body').children().eq(i).children().eq(5).children().val();
        prescription.push(medicine);
    }

    var param = {
        chartNumber: $('#preChartId').val(),
        impression: $('.impression').val().replace(/\n/g, "<br>"),
        presentIllness: $('.presentIllness').val().replace(/\n/g, "<br>"),
        treatmentNote: $('.treatmentNote').val().replace(/\n/g, "<br>"),
        updateStatus: 3,
        prescription: JSON.stringify(prescription)
    }

    $.ajax({
        type: 'POST',
        url: '/chart/update',
        data: param,
        dataType: 'json',
        cache: false,
    }).done(result => {

        if (result[0] === 0) {

            $('.treatmentNote').val('');
            $('#diagonosisChartForm, #preDiagonosisChartForm, #patientChartForm').each(function(){
                this.reset();
            });

            if ($('#originalDiagnosisCCsegment').children().length) {
              $('#originalDiagnosisCCsegment *').remove();
            }

            if ($('#prescription-table-body').children().length > 0) {
                $('#prescription-table-body *').remove();
            }

            $('#pastDiagnosisRecord').attr('disabled', true);
            $('#vitalSign').attr('disabled', true);
            $('#pharmacopoeia').attr('disabled', true);
            $('#diagonosis').attr('disabled', true);
            $('#preDiagonosis').attr('disabled', true);
            $('#patientInfo').attr('disabled', true);

            $.uiAlert({
                textHead: '[알림]',
                text: '차트번호 ' + param.chartNumber + ' 본진 서명 완료되었습니다.',
                bgcolor: '#19c3aa',
                textcolor: '#fff',
                position: 'top-left',
                time: 2,
            })

            window.scrollTo(0, 0);
        } else {
            alert('[System Error]\n IT 본부 단원에게 문의해주세요.');
        }
    })
})


/**
 *
 * 약전 클릭시
 */
$('#pharmacopoeia').on('click', () => {

    if ($('.main-category-select > select').children().length) {
        $('.main-category-select > select *').remove();
        $('.main-category-select > select').append(
            `<option class='' value=''>대분류</option>`
        )
    }

    if ($('.small-category-select > select').children().length) {
        $('.small-category-select > select *').remove();
        $('.small-category-select > select').append(
            `<option class='default' value=''>소분류</option>`
        )
    }

    $.ajax({
        type: 'GET',
        url: '/medicine/category/main',
        dataType: 'json',
        cache: false,
    }).done(results => {
        /**
         * 데이터 추가 후 modal
         */
        $('.main-category-select > select').append(
            _.map(results, result => `<option value='${result.primaryCategory}'> ${result.primaryCategory} </option>`)
        );
    });

    $('.ui.longer.modal.pharmacopoeia').modal('show')
    $('.dropdown').dropdown()
});

/**
 * 본진 정보 클릭
 */
$('#diagonosis').on('click', () => {
    showAndHide('main-hide-and-show-row', 'diagnosis-container');
})

/**
 * 예진 정보 클릭
 */
$('#preDiagonosis').on('click', () => {
    showAndHide('main-hide-and-show-row', 'pre-diagnosis-container');
})

/**
 * 환자 정보 클릭
 */
$('#patientInfo').on('click', () => {
    showAndHide('main-hide-and-show-row', 'patient-info-container');
})

/**
 * 과거 진료 기록
 */
// $('#past-chart-ori-diagonosis').on('click', () => {
$(document).on('click', '#past-chart-ori-diagnosis', () => {
    showAndHide('past-hide-and-show-row', 'past-chart-diagnosis-container');
})

/**
 * 과거 예진 기록
 */
$(document).on('click', '#past-chart-pre-diagnosis', () => {
    showAndHide('past-hide-and-show-row', 'past-chart-pre-diagnosis-container');
})

/**
 * vital sign 생성
 */
$('#vitalSign').on('click', () => {
    showAndHide('main-hide-and-show-row', 'vital-sign-container');

    function _each(data, iter) {
        if (Array.isArray(data)) {
            for (let i = 0, len = data.length; i < len; i++) {
                iter(data[i], i, data);
            }
        } else {
            for (let i = 0, keys = Object.keys(data), len = keys.length; i < len; i++) {
                iter(data[keys[i]], keys[i], i, data);
            }
        }
    }

    /**
     *
     * @param {array} vitalDatas
     * @param {array} types      y 축 대상자들
     * @param {string} standard  x 축 기준이 될 것
     */
    const dataInput = (vitalDatas, types, standard) => {
        let new_columns = [];
        const startIndex = 0;
        const notFoundIndex = -1;

        _.each(vitalDatas, (vitalData, vitalIndex) => {
            _each(vitalData, (data, key, i) => {
                // 초기화
                if (!new_columns[i]) {
                    new_columns[i] = [];
                }
                //types 에 포함되어있어야만 push
                if (!_.eq(_.findIndex(types, (type) => type === key), notFoundIndex)) {
                    if (_.eq(vitalIndex, startIndex)) {
                        // key insert
                        if (_.eq(key, standard)) {
                            new_columns[i].push('x');
                        } else {
                            new_columns[i].push(key);
                        }
                    }
                    //value insert
                    if (_.eq(key, standard)) {
                        new_columns[i].push(moment(data).format('YYYY-MM-DD'));
                    } else {
                        new_columns[i].push(data);
                    }
                }
            });
        })
        return new_columns;
    }


    const chartGenerator = _.flow((chartDataInfo) => {
        const { vitalDatas, types, selectGraph } = chartDataInfo;
        const standard = 'createdAt';
        const info = {
            "x": "x",
            "columns": []
        };
        info.columns = dataInput(vitalDatas, types, standard);

        const returnToData = {
            info,
            selectGraph
        }
        return returnToData;

    }, function (result) {
        const { info, selectGraph } = result;


        var chart = bb.generate({
            "data": info,
            "axis": {
                "x": {
                    "type": "timeseries"
                }
            },
            "bindto": `#${selectGraph}`
        });

    })


    /**
     * get data
     */
    const parentId = 1;

    http
        .getMethod(`/chart/vitalSign/${parentId}`)
        .then((result) => {
            const { data, code } = result;

            if (!_.eq(code, resultCode.success)) {
                return Promise.reject('fail vital data');
            }
            return Promise.resolve(data);

        }).then(datas => {
            const startArd = 'createdAt';
            // heartRate tinyint(3), # HR 심박수
            // pulseRate tinyint(3), # PR 맥박수
            // bodyTemporature tinyint(3), # BT 체온
            // systoleBloodPressure tinyint(3), # BP 혈압 수축기
            // diastoleBloodPressure tinyint(3), # BP 혈압 이완기
            // bloodGlucose tinyint(3), # Glucose 혈당

            /**
             * generator graph
             */
            const heartRateChart = {
                vitalDatas: datas,
                types: ['createdAt', 'heartRate'],
                selectGraph: 'heartRateChart'
            }
            chartGenerator(heartRateChart);

            const pulseRateChart = {
                vitalDatas: datas,
                types: ['createdAt', 'pulseRate'],
                selectGraph: 'pulseRateChart'
            }
            chartGenerator(pulseRateChart);

            const BloodPressureChart = {
                vitalDatas: datas,
                types: ['createdAt', 'systoleBloodPressure', 'diastoleBloodPressure'],
                selectGraph: 'bloodPressureChart'
            }
            chartGenerator(BloodPressureChart);

            const bloodGlucoseChart = {
                vitalDatas: datas,
                types: ['createdAt', 'bloodGlucose'],
                selectGraph: 'bloodGlucoseChart'
            }
            chartGenerator(bloodGlucoseChart);

            const bodyTemporatureChart = {
                vitalDatas: datas,
                types: ['createdAt', 'bodyTemporature'],
                selectGraph: 'bodyTemporatureChart'
            }
            chartGenerator(bodyTemporatureChart);


        }).catch((error) => {

            /**
             * TODO 실패했을 때 표시
             */
        })

});

init();
