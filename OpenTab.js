function openSection(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}

function openDropdown(evt, butName) {
	if ($(evt.currentTarget).hasClass("active")) {
		document.getElementById(butName).style.display = "none";
		evt.currentTarget.className = evt.currentTarget.className.replace(" active", "");
	} else {
		document.getElementById(butName).style.display = "block";
		evt.currentTarget.className += " active";
	}
}