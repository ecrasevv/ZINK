$(document).ready(function() {
    // when the page is loaded show today's leaderboard
        $("#mt-content").hide();
        $("#yr-content").hide();

    // handle today
    $("#td").click(function() {
        $("#td-content").show();
        $("#mt-content").hide();
        $("#yr-content").hide();
    });

    // handle month
    $("#mt").click(function() {
        $("#mt-content").show();
        $("#td-content").hide();
        $("#yr-content").hide();
    });

    // handle year
    $("#yr").click(function() {
        $("#yr-content").show();
        $("#td-content").hide();
        $("#mt-content").hide();
    });
});
