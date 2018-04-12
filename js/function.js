$(document).ready(function() {
  // INITIALIZE
  $('.modal').modal();

  // DECLARE VARIABLES
  var roll_count = 0;
  var primary_color = "#f1650b";
  var gray = "#505050";

  // DICE ==================================================================================================
  // ROLL DICE
  $("#roll-dice").click(function() {
    if (roll_count < 3) {
      roll_count++;

      $.each(dice, function(i) {
        var dice_no = i+1;
        if (this.saved == false) {
          this.number = Math.floor((Math.random() * 6) + 1);
          $("#dice" + dice_no).css("background-image", "url('images/dice" + this.number + ".svg')");
        }
      });

      if (roll_count > 0) {
        $(".roll-" + (roll_count)).css("color", primary_color);
      } else {
        $(".roll").css("color", gray);
      }

    } else {
      Materialize.toast('No More Rolls!', 2000)
    }

  });

  // SAVE DICE
  $(document).on("click", ".dice", function() {
    var current = dice[$(this).attr("data-index")];
    if (current.saved == false) {
      current.saved = true;
      $(this).addClass("saved")
    } else {
      current.saved = false;
      $(this).removeClass("saved")
    }
  });

  // RESET DICE
  var reset_dice = function reset_dice() {
    roll_count = 0;
    $(".dice").removeClass("saved").css("background-image", "none");
    $.each(dice, function(i) {
      this.saved = false;
    });
    $(".roll").css("color", gray);
  };

  $("#reset").click(function() {
    window.location.reload();
  });

  // POPULATE SCORE SHEET ==================================================================================
  $.each(scores, function(key, val) {
    $(".score-section").append(`
      <table class="` + key + `">
        <thead><tr>
          <th>Status</th>
          <th>Title</th>
          <th>Description</th>
          <th>Score</th>
        </tr></thead>
        <tbody></tbody>
        <tfoot></tfoot>
      </table>
    `);

    $.each(val, function(i) {
      $(".score-section table:last-child tbody").append(`
        <tr data-index="` + i + `">
          <td><input type="checkbox" id="` + key + i + `" /><label for="` + key + i + `">Used</label></td>
          <td>` + this.title + `</td>
          <td><small>(` + this.description + `)<small></td>
          <td class="score">` + this.score + `</td>
        </tr>
      `);
    });
  });

  $("table.upper tfoot").append(`
    <tr>
      <td></td>
      <td>Total</td>
      <td><small>(Add Above Scores)</small></td>
      <td class="upper-before-bonus"></td>
    </tr>
    <tr>
      <td></td>
      <td>Bonus</td>
      <td><small>(If 63 or over add 35)</small></td>
      <td class="upper-bonus"></td>
    </tr>
    <tr>
      <td></td>
      <td>Upper Section Total</td>
      <td><small>(Upper Section Total)</small></td>
      <td class="upper-total"></td>
    </tr>
  `);

  $("table.lower tfoot").append(`
    <tr>
      <td></td>
      <td>Lower Section Total</td>
      <td><small>(Add Above Scores)</small></td>
      <td class="lower-total"></td>
    </tr>
    <tr>
      <td></td>
      <td>Upper Section Total</td>
      <td><small>(Total From Upper Section)</small></td>
      <td class="upper-total"></td>
    </tr>
    <tr>
      <td></td>
      <td>Grand Total</td>
      <td><small>(Sum of Section Totals)</small></td>
      <td class="grand-total"></td>
    </tr>
  `);

  // CALCULATE SCORES ======================================================================================
  $(document).on("click", "table tbody td label", function(e) {
    var input = $(this).siblings("input");

    if (roll_count == 0) {
      e.preventDefault();
      Materialize.toast('Roll the Dice!', 2000);
    } else if (input.is(":checked")) {
      e.preventDefault();
      Materialize.toast('Score Already Used', 2000);
    } else if (!input.is(":checked")) {
      reset_dice();

      var formula_id = $(this).attr("for");
      var index = $(this).parents("tr").attr("data-index");
      calc_score(index, formula_id);

      var game_over = $("tbody").find("input[type='checkbox']:checked").length;
      if (game_over >= 12) {
        $('#game-over').modal('open');
      }
    }




  });




});
