import { Component } from '@theme/component';

/**
 * A custom element that renders a video background.
 *
 * @typedef {object} Refs
 * @property {HTMLElement[]} videoSources - The video sources.
 * @property {HTMLVideoElement} videoElement - The video element.
 *
 * @extends Component<Refs>
 */
export class VideoBackgroundComponent extends Component {
  requiredRefs = ['videoSources', 'videoElement'];
  loaded = false;

  connectedCallback() {
    super.connectedCallback();

    const isDesktopOnly = this.classList.contains('hero__media-wrapper--desktop') || this.closest('.hero__media-wrapper--desktop');
    const isMobileOnly = this.classList.contains('hero__media-wrapper--mobile') || this.closest('.hero__media-wrapper--mobile');

    const desktopMedia = window.matchMedia('(min-width: 750px)');
    const mobileMedia = window.matchMedia('(max-width: 749px)');

    const loadVideo = () => {
      if (this.loaded) return;
      this.loaded = true;

      const { videoSources, videoElement } = this.refs;

      for (const source of videoSources) {
        const { videoSource } = source.dataset;

        if (videoSource) source.setAttribute('src', videoSource);
      }

      videoElement.load();
    };

    const checkViewportAndObserve = () => {
      if (isDesktopOnly && !desktopMedia.matches) {
        desktopMedia.addEventListener('change', (e) => {
          if (e.matches) checkViewportAndObserve();
        }, { once: true });
        return;
      }

      if (isMobileOnly && !mobileMedia.matches) {
        mobileMedia.addEventListener('change', (e) => {
          if (e.matches) checkViewportAndObserve();
        }, { once: true });
        return;
      }

      // If viewport matches (or is not restricted), observe it for intersection
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadVideo();
              observer.disconnect();
            }
          });
        }, { rootMargin: '200px' });

        observer.observe(this);
      } else {
        loadVideo();
      }
    };

    checkViewportAndObserve();
  }
}

if (!customElements.get('video-background-component')) {
  customElements.define('video-background-component', VideoBackgroundComponent);
}
