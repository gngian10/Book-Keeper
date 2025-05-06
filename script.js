const popover = $(".popover");
const websiteName = $(".website-name");
const websiteUrl = $(".website-url");
const form = $("form");
const bookmarkContainer = $(".bookmark-container");

let bookmarksMap = new Map();

function displayBookmarks() {
    bookmarkContainer.innerHTML = "";

    bookmarksMap.forEach((bookmark) => {
        const { websiteNameValue, websiteUrlValue } = bookmark;

        let singleBookmark = document.createElement("div");
        singleBookmark.classList.add("item");
        singleBookmark.innerHTML = `
            <ion-icon name="close-outline" class="close-icon"></ion-icon>

            <img
                src="https://www.google.com/s2/favicons?domain=${websiteUrlValue}"
                alt="${websiteNameValue}"
            />

            <a href="${websiteUrlValue}" target="_blank">${websiteNameValue}</a>
        `;

        let closeIcon = singleBookmark.querySelector(".close-icon");
        if (closeIcon) {
            closeIcon.addEventListener("click", () =>
                deleteBookmark(websiteNameValue)
            );
        }

        bookmarkContainer.appendChild(singleBookmark);
    });
}

// function fetchBookmarks() {
//     let bookmarksStored = JSON.parse(sessionStorage.getItem("bookmarks"));

//     if (bookmarksStored && bookmarksStored.length > 0) {
//         bookmarksStored.forEach((bookmark) => {
//             bookmarksMap.set(bookmark.websiteNameValue, bookmark);
//         });

//         displayBookmarks();
//     } else {
//         console.log("Bookmarks not found");
//     }
// }

// Form
function submitForm(e) {
    e.preventDefault();

    let websiteNameValue = websiteName.value;
    let websiteUrlValue = websiteUrl.value;

    if (!validateInputs(websiteNameValue, websiteUrlValue)) return;

    websiteUrlValue = correctUrl(websiteUrlValue);

    let bookmark = {
        websiteNameValue,
        websiteUrlValue,
    };

    // Validate if there is already website name
    if (bookmarksMap.has(websiteNameValue)) {
        if (
            bookmarksMap.get(websiteNameValue).websiteUrlValue !==
            websiteUrlValue
        ) {
            alert(`${websiteNameValue} updated`);
        } else {
            alert("You need to provide a different url to change it");
        }
    }

    // Store into map
    bookmarksMap.set(websiteNameValue, bookmark);

    // Store into session storage
    sessionStorage.setItem(
        "bookmarks",
        JSON.stringify([...bookmarksMap.values()])
    );

    // Fetch bookmarks
    displayBookmarks();

    resetForm();
}

function deleteBookmark(websiteName) {
    bookmarkContainer.innerHTML = "";

    bookmarksMap.delete(websiteName);

    sessionStorage.setItem(
        "bookmarks",
        JSON.stringify([...bookmarksMap.values()])
    );

    // fetchBookmarks();
    displayBookmarks();
}

// Validations
function validateInputs(websiteName, websiteUrl) {
    if (!websiteName || !websiteUrl) {
        alert("Please fill both inputs");

        return false;
    }

    return true;
}

function correctUrl(websiteUrl) {
    let regex = /\.com$/i;

    if (
        !websiteUrl.startsWith("http://") &&
        !websiteUrl.startsWith("https://")
    ) {
        websiteUrl = `https://${websiteUrl}`;
    }

    if (!regex.test(websiteUrl)) {
        websiteUrl = `${websiteUrl}.com`;
    }

    return websiteUrl;
}

// Show bookmarks
displayBookmarks();

// Events
popover.addEventListener("toggle", () => {
    if (popover.matches(":popover-open")) {
        websiteName.focus();
    }
});

form.addEventListener("submit", submitForm);

// Helpers
function $(elem) {
    return document.querySelector(elem);
}

function resetForm() {
    form.reset();

    websiteName.focus();
}

function selectElem(elem) {
    return document.querySelector(elem);
}
