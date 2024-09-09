(() => {
    const numImages = 53;

    // See whether overlays are even enabled
    chrome.storage.local.get(['overlayEnabled'], (result) => {
        const enabled = result.overlayEnabled !== false; // default to true if not set
        const opacity = enabled ? '1' : '0';

        // get all yt thumbnails
        function getThumbnails() {
            const thumbnails = document.querySelectorAll("ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element),.ytp-videowall-still-image:not([style*='extension:'])");

            thumbnails.forEach((thumbnail) => {
                const index = getRandomImageIndex();
                let OverlayUrl = getOverlayUrl(index);
                changeThumbnail(thumbnail, OverlayUrl);
            });
        }

        // Apply new (and improved) thumbnails
        function changeThumbnail(thumbnail, OverlayUrl) {
            const overlay = document.createElement("img");
            overlay.src = OverlayUrl;
            overlay.style.position = "absolute";
            overlay.style.top = overlay.style.left = "0";
            overlay.style.width = overlay.style.height = "100%";
            overlay.style.zIndex = "10";
            overlay.style.opacity = opacity; // Apply the opacity here
            thumbnail.parentElement.appendChild(overlay);
        }

        // Get random image index
        function getRandomImageIndex() {
            return Math.floor(Math.random() * numImages) + 1;
        }

        // Get URL of the overlay image
        function getOverlayUrl(index) {
            return chrome.runtime.getURL(`assets/images/${index}.png`);
        }

        // Observe the entire body of the document for changes
        const observer = new MutationObserver(() => {
            getThumbnails();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Initial call to set thumbnails on page load
        getThumbnails();
    });
})();