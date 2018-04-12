// CALCULATE TOTALS ========================================================================================
var calc_totals = function calc_totals() {
  var upper_total = 0;
  var lower_total = 0;
  var grand_total = upper_total + lower_total;

  $.each(scores, function(key, val) {
    $.each(val, function(i) {
      if (key == "upper" && this.score != "") {
        upper_total += this.score;
      } else if (key =="lower" && this.score != "") {
        lower_total += this.score;
      }
    });
  });


  // Upper Section Total
  $(".upper-before-bonus").html(upper_total);
  if (upper_total >= 63) {
    upper_total += 35;
    $(".upper-bonus").html("35");
  } else {
    $(".upper-bonus").html("0");
  }
  $(".upper-total").html(upper_total);

  // Lower Section Total
  $(".lower-total").html(lower_total);

  // Grand Total
  $(".grand-total").html(lower_total + upper_total);

}

// CALCULATE SCORE =========================================================================================
var calc_score = function calc_score(index,formula_id) {

  // All Upper Section
  if (formula_id == "upper0" || formula_id == "upper1" || formula_id == "upper2" || formula_id == "upper3" || formula_id == "upper4" || formula_id == "upper5") {
    var dice_value = parseInt(index) + 1;
    var score = 0;

    $.each(dice, function(i) {
      if (this.number == dice_value) {
        score += this.number;
      }
    });

    scores.upper[index].score = score;
    $("table tr td label[for='" + formula_id + "']").parents("tr").find(".score").text(score);
  }

  // All Lower Section
  if (formula_id == "lower0" || formula_id == "lower1" || formula_id == "lower2" || formula_id == "lower3" || formula_id == "lower4" || formula_id == "lower5" || formula_id == "lower6") {
    var all_dice = {1: null, 2: null, 3: null, 4: null, 5: null, 6: null};
    var score = 0;
    var final_socre = 0;
    var two_kind = false;
    var three_kind = false;
    var four_kind = false;
    var sm_str8 = 0;
    var lg_str8 = true;
    var yahtzee = false;
    var sm_str8_arr = [];

    $.each(dice, function(i) {
      var number = this.number;
      sm_str8_arr.push(number);
      $.each(all_dice, function(key, val) {
        if (number == key) {
          all_dice[number]++;
        }
      });
      score += this.number;
    });

    $.each(all_dice, function(key,val) {
      if (val == 5) {
        yahtzee = true;
        three_kind = true;
        four_kind = true;
      }
      if (val >= 4) {
        three_kind = true;
        four_kind = true;
      }
      if (val >= 3) {three_kind = true;}
      if (val == 2) {two_kind = true;}
      if (val > 1 || (all_dice[1] != null && all_dice[6] != null)) {lg_str8 = false;}
    });

    sm_str8_arr.sort(function(a, b){return a-b});
    $.each(sm_str8_arr, function(i) {
      if (sm_str8_arr[i] - sm_str8_arr[i-1] != 1) {
        sm_str8++;
      }
    });

    // Yahtzee
    if (yahtzee == true && formula_id == "lower5") {
      final_score = 50;
    // Four/Three of a Kind & Chance
    } else if ((four_kind == true && formula_id == "lower1") || (three_kind == true && formula_id == "lower0") || formula_id == "lower6") {
      final_score = score;
    // Full House
    } else if (two_kind == true && three_kind == true && formula_id == "lower2") {
      final_score = 25;
    // Small Straight
    } else if (sm_str8 <= 2 && formula_id == "lower3") {
      final_score = 30;
    // Large Straight
    } else if (lg_str8 == true && formula_id == "lower4") {
      final_score = 40;
    // Failure
    } else {
      final_score = 0;
    }

    scores.lower[index].score = final_score;
    $("table tr td label[for='" + formula_id + "']").parents("tr").find(".score").text(final_score);
  }


  calc_totals();
}
