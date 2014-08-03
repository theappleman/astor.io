function createHeader() {
	var $navbarhead = $("<div>"),
		$div = $("<div>"),
		$home = $("<a>"),
		$navtoggle = $("<button>"),
		$navheader = $("<div>"),
		$collapse = $("<div>"),
		$ulnav = $("<ul>"),
		$navform = $("<ul>"),
		i;
		
	$("h2").hide();
	$("head").append($("<meta>").attr("name", "viewport").attr("content", "width=device-width, initial-scale=1"));
	
	$navheader.attr("class", "navbar-header");
	
	$navtoggle.attr("class", "navbar-toggle");
	$navtoggle.attr("type", "button");
	$navtoggle.attr("data-toggle", "collapse");
	$navtoggle.attr("data-target", ".navbar-responsive-collapse");
	for (i = 0; i <= 2; i++) {
		var $span = $("<span>");
		$span.attr("class", "icon-bar");
		$navtoggle.append($span);
	}
	$navbarhead.append($navtoggle);

	$home.attr("href", "/");
	$home.attr("class", "navbar-brand");
	$home.text("astor.io");

	$navbarhead.append($home);
	$div.attr("class", "navbar navbar-default");
	$div.attr("role", "navigation");
	$navbarhead.attr("class", "navbar-header");
	$div.append($navbarhead);
	
	$collapse.attr("class", "navbar-collapse collapse navbar-responsive-collapse");
	$ulnav.attr("class", "nav navbar-nav");
	$navform.addClass("navbar-form").append($("<input>"));
	if (undefined !== window.navigator.mozApps) {
		$navform.prepend($("<button>").text("install").addClass("install btn btn-primary navbar-form"));
	}
	
	$collapse.append($ulnav);
	$collapse.append($navform);
	$div.append($collapse);

	$("body").prepend($div);
	$("body").addClass("container");
	$("input").addClass("form-control").addClass("input-sm");
	$("input").attr("placeholder", "astor/home");
	$("input").attr("type", "url");
	$("input").attr("tabindex", "1");
	$("input").attr("accesskey", "s");
	$("input").on("keypress", function (ev) {
		var key = $("input").val();
		if (ev.keyCode === 13 && key.length > 0) {
			ev.preventDefault();
			cacheOrGet(key);
			history.pushState({}, "", "?" + key);
		}
	});
	if (sessionStorage.getItem('flash') !== null) {
		sessionStorage.clear('flash');
		var $div = $("<div>"),
			$button = $("<button>"),
			$strong = $("<strong>");
		$strong.text("The application has not been installed!");
		$button.attr("type", "button");
		$button.attr("data-dismiss", "alert");
		$button.addClass("close");
		$button.text("x");

		$div.addClass("alert").addClass("alert-warning");
		$div.addClass("alert-danger");
		$div.text("Your browser does not support installing this website.");
		$div.prepend($("<br>"));
		$div.prepend($strong);
		$div.prepend($button);
		$("content").append($div);
	}
	
	$(".install").on("click", function(ev) {
		ev.preventDefault();
		var manifesturl = "http://astor.io/manifest.webapp"
		if (undefined !== window.navigator.mozApps) {
			// Ignore any non-mozilla browsers
			var request = window.navigator.mozApps.install(manifesturl);
			request.onsuccess = function () {
				var appRecord = this.result;
				alert("Installed successfully!");
			};
			request.onerror = function () {
				alert("Failed: " + this.error.name);
			};
		} else {
			alert("This option is not available for your platform");
		}
	});
}

function display(json) {
	$("head title").text(json.title);
	if (json.media === "video") {
		var $video = $("<video>");
		$video.attr("src", json.src);
		$video.attr("type", json.type);
		$video.attr("controls", true);
		$("content").append($video);
	} else if (json.media === "audio") {
		var $audio = $("<audio>");
		$audio.attr("src", json.src);
		$audio.attr("type", json.type);
		$audio.attr("controls", true);
		$("content").append($audio);
	}
	$("content").append($("<h3>").text(json.title));
	if (json.html === undefined) {
		$("content").append($("<p>").text(json.text));
	} else {
		$("content").append(json.html);
	}
	$("content").append($("<p>").append($("<small>").text(json.date)));
}

function cacheOrGet(key) {
	$("content").text("");
	$("input").attr("placeholder", key);
	if (localStorage.getItem(key) === null) {
		$.getJSON(key, function (json) {
			localStorage[key] = JSON.stringify(json);
			display(json);
		}).fail(function (ev) {
			var $div = $("<div>"),
				$button = $("<button>"),
				$strong = $("<strong>");
			$strong.text("There has been an error!");
			$button.attr("type", "button");
			$button.attr("data-dismiss", "alert");
			$button.addClass("close");
			$button.text("x");

			$div.addClass("alert").addClass("alert-dismissable");
			$div.addClass("alert-danger");
			$div.text("Please refresh the page and try again.");
			$div.prepend($("<br>"));
			$div.prepend($strong);
			$div.prepend($button);
			$("content").append($div);
			$("head title").text("ERROR");
		});
	} else {
		var json = JSON.parse(localStorage.getItem(key));
		display(json);
	};
}
	

function main() {
	"use strict";
	createHeader();


	var url = window.location.href;
	var params = url.split('?');
	console.log(params[1]);
	if (params[1] === undefined || params[1].length == 0) {
		cacheOrGet("http://s.astor.io/"+"astor/home");
	} else {
		cacheOrGet(params[1]);
	}

}

$(document).ready(main);
