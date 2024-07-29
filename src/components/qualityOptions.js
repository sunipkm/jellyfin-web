import { appHost } from '../components/apphost';
import globalize from '../scripts/globalize';
import appSettings from '../scripts/settings/appSettings';

export function getVideoQualityOptions(options) {
    const maxStreamingBitrate = options.currentMaxBitrate;
    let videoWidth = options.videoWidth;
    const videoHeight = options.videoHeight;

    // If the aspect ratio is less than 16/9 (1.77), set the width as if it were pillarboxed.
    // 4:3 1440x1080 -> 1920x1080
    if (videoWidth / videoHeight < 16 / 9) {
        videoWidth = videoHeight * (16 / 9);
    }

    const maxVideoWidth = options.maxVideoWidth == null ? appSettings.maxVideoWidth() : options.maxVideoWidth;

    const hostScreenWidth = (maxVideoWidth < 0 ? appHost.screen()?.maxAllowedWidth : maxVideoWidth) || 4096;
    const maxAllowedWidth = videoWidth || 4096;

    const qualityOptions = [];

    const autoQualityOption = {
        name: globalize.translate('Auto'),
        bitrate: 0,
        selected: options.isAutomaticBitrateEnabled
    };

    if (options.enableAuto) {
        qualityOptions.push(autoQualityOption);
    }

    // Quality options are indexed by bitrate. If you must duplicate them, make sure each of them are unique (by making the last digit a 1)
    if (maxAllowedWidth >= 3800) {
        qualityOptions.push({ name: '4K - 8 Mbps', maxHeight: 2160, bitrate: 8000000 });
        qualityOptions.push({ name: '4K - 6 Mbps', maxHeight: 2160, bitrate: 6000000 });
    }
    if (maxAllowedWidth >= 2500) {
        qualityOptions.push({ name: '2K - 4 Mbps', maxHeight: 1440, bitrate: 4000000 });
        qualityOptions.push({ name: '2K - 3.5 Mbps', maxHeight: 1440, bitrate: 3500000 });
    }
    // Some 1080- videos are reported as 1912?
    if (maxAllowedWidth >= 1900) {
        qualityOptions.push({ name: '1080p - 3 Mbps', maxHeight: 1080, bitrate: 3000000 });
        qualityOptions.push({ name: '1080p - 2 Mbps', maxHeight: 1080, bitrate: 2000000 });
    }
    if (maxAllowedWidth >= 1260) {
        qualityOptions.push({ name: '720p - 1.5 Mbps', maxHeight: 720, bitrate: 1500000 });
        qualityOptions.push({ name: '720p - 1 Mbps', maxHeight: 720, bitrate: 1000000 });
    }
    if (maxAllowedWidth >= 620) {
        qualityOptions.push({ name: '480p - 720 kbps', maxHeight: 480, bitrate: 750000 });
        qualityOptions.push({ name: '480p - 420 kbps', maxHeight: 480, bitrate: 420001 });
    }

    qualityOptions.push({ name: '360p - 420 kbps', maxHeight: 360, bitrate: 420000 });

    if (maxStreamingBitrate) {
        let selectedIndex = qualityOptions.length - 1;
        for (let i = 0, length = qualityOptions.length; i < length; i++) {
            const option = qualityOptions[i];

            if (option.bitrate > 0 && option.bitrate <= maxStreamingBitrate) {
                selectedIndex = i;
                break;
            }
        }

        const currentQualityOption = qualityOptions[selectedIndex];

        if (!options.isAutomaticBitrateEnabled) {
            currentQualityOption.selected = true;
        } else {
            autoQualityOption.autoText = currentQualityOption.name;
        }
    }

    return qualityOptions;
}

export function getAudioQualityOptions(options) {
    const maxStreamingBitrate = options.currentMaxBitrate;

    const qualityOptions = [];

    const autoQualityOption = {
        name: globalize.translate('Auto'),
        bitrate: 0,
        selected: options.isAutomaticBitrateEnabled
    };

    if (options.enableAuto) {
        qualityOptions.push(autoQualityOption);
    }

    qualityOptions.push({ name: '2 Mbps', bitrate: 2000000 });
    qualityOptions.push({ name: '1.5 Mbps', bitrate: 1500000 });
    qualityOptions.push({ name: '1 Mbps', bitrate: 1000000 });
    qualityOptions.push({ name: '320 kbps', bitrate: 320000 });
    qualityOptions.push({ name: '256 kbps', bitrate: 256000 });
    qualityOptions.push({ name: '192 kbps', bitrate: 192000 });
    qualityOptions.push({ name: '128 kbps', bitrate: 128000 });
    qualityOptions.push({ name: '96 kbps', bitrate: 96000 });
    qualityOptions.push({ name: '64 kbps', bitrate: 64000 });

    if (maxStreamingBitrate) {
        let selectedIndex = qualityOptions.length - 1;
        for (let i = 0, length = qualityOptions.length; i < length; i++) {
            const option = qualityOptions[i];

            if (option.bitrate > 0 && option.bitrate <= maxStreamingBitrate) {
                selectedIndex = i;
                break;
            }
        }

        const currentQualityOption = qualityOptions[selectedIndex];

        if (!options.isAutomaticBitrateEnabled) {
            currentQualityOption.selected = true;
        } else {
            autoQualityOption.autoText = currentQualityOption.name;
        }
    }

    return qualityOptions;
}

export default {
    getVideoQualityOptions,
    getAudioQualityOptions
};
