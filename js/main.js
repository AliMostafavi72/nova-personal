/**
 * Main JS (Vanilla jQuery version)
 * Optimized by Hegmata Web - https://hegmata-web.ir
 * Handles: Preloader, Portfolio Isotope, Scroll Effects, Stellar, Owl Carousel, Magnific Popup, Contact Form
 */

$(window).on("load", function () {
    // ===================== Preloader =====================
    setTimeout(function () {
        $(".preloader").addClass("loaded");
    }, 1000);

    // ===================== Portfolio Filtering (Isotope) =====================
    if ($(".portfolio-items").length) {
        $(".portfolio-items").isotope(); // Initialize Isotope

        $(".portfolio-filter ul li").on("click", function () {
            $(".portfolio-filter ul li").removeClass("sel-item");
            $(this).addClass("sel-item");

            const filterValue = $(this).attr("data-filter");
            $(".portfolio-items").isotope({
                filter: filterValue,
                animationOptions: { duration: 750, easing: "linear", queue: false }
            });
        });
    }
});

$(function () {
    "use strict";
    const $window = $(window);

    // ===================== Fullscreen Home Section =====================
    function setHomeHeight() {
        $("#home").css({ height: $window.height() + "px" });
    }
    setHomeHeight();
    $window.resize(setHomeHeight);

    // ===================== Smooth Scrolling =====================
    $.scrollIt({
        upKey: 38,
        downKey: 40,
        easing: "swing",
        scrollTime: 600,
        activeClass: "active",
        onPageChange: null,
        topOffset: -15
    });

    // ===================== Navbar Fixed on Scroll =====================
    $window.on("scroll", function () {
        const scroll = $window.scrollTop();
        const navbar = $(".navbar");
        if (scroll > 300) navbar.addClass("fixed-top");
        else navbar.removeClass("fixed-top");
    });

    // ===================== Stats Counter Animation =====================
    if ($("section.stats").length > 0) {
        let counted = false;
        $window.on("scroll", function () {
            const statsOffset = $("section.stats").offset().top - window.innerHeight;
            if (!counted && $window.scrollTop() > statsOffset) {
                $("section.stats .single-stat .counter").each(function () {
                    const $this = $(this);
                    const countTo = $this.attr("data-count");

                    $({ countNum: $this.text() }).animate(
                        { countNum: countTo },
                        {
                            duration: 2000,
                            easing: "swing",
                            step: function () {
                                $this.text(Math.floor(this.countNum));
                            },
                            complete: function () {
                                $this.text(this.countNum);
                            }
                        }
                    );
                });
                counted = true;
            }
        });
    }

    // ===================== Collapse Navbar on Click =====================
    $(".nav-item .nav-link").on("click", function () {
        $(".navbar-collapse").removeClass("show");
    });

    // ===================== Stellar Parallax =====================
    $window.stellar({ horizontalScrolling: false });

    // ===================== Portfolio Magnific Popup =====================
    $(".portfolio .link").magnificPopup({
        delegate: "a",
        type: "image",
        gallery: { enabled: true }
    });

    // ===================== Owl Carousel =====================
    $(".blogs .owl-carousel").owlCarousel({
        loop: true,
        margin: 30,
        autoplay: true,
        smartSpeed: 500,
        responsiveClass: true,
        dots: false,
        responsive: {
            0: { items: 1 },
            700: { items: 2 },
            1000: { items: 3 }
        }
    });

    $(".testimonials .owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        smartSpeed: 500
    });

    // ===================== Contact Form Submission =====================
    $("#contact-form").on("submit", function (e) {
        e.preventDefault();

        const $form = $(this);
        $("#form-submit").val("Wait...");

        const name = $("#contact-name").val(),
            email = $("#contact-email").val(),
            message = $("#contact-message").val();

        let errors = 0;

        // ===================== Validation =====================
        $(".con-validate", $form).each(function () {
            if ($(this).val() === "") {
                $(this).addClass("con-error");
                errors++;
            } else if ($(this).hasClass("con-error")) {
                $(this).removeClass("con-error");
                if (errors > 0) errors--;
            }
        });

        if (errors === 0) {
            $.ajax({
                type: "POST",
                url: "mail.php",
                data: { con_name: name, con_email: email, con_message: message },
                success: function (res) {
                    $("#contact-form input, #contact-form textarea").val("");
                    $("#contact-submit.primary-button span").html("Done!");
                    $("#contact-submit.primary-button").addClass("ok");
                    console.log(res);
                },
                error: function () {
                    $("#contact-submit.primary-button span").html("Failed!");
                }
            });
        } else {
            console.log("Validation Error");
        }
    });

    // ===================== Remove Error Class on Typing =====================
    $(".con-validate").keyup(function () {
        $(this).removeClass("con-error");
    });
});
