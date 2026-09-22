/**
 * Adds a string as a system clipboard entry
 */
async function setClipboard(text: string) {
    const type = "text/plain";

    const clipboardItemData =  {
        [type]: text
    };

    const clipboardItem = new ClipboardItem(clipboardItemData);
    await navigator.clipboard.write([clipboardItem]);
}

/**
 * Returns a timestamp in the 12 hour system plus the date
*/
function formatTime(timestamp: Date): string {
    let isAM = true;
    const hour = (() => {
        const timestampHours = timestamp.getHours();
        /**
         * Changing from AM to PM with this logic ensures
         * midday isn't labelled as AM and anything after is converted to the
         * 12 hour system
        */
        if (timestampHours >= 12) { // anything from midday onwards get's labelled as PM
            isAM = false;
        };
        if (timestampHours >= 13) {
            return timestampHours - 12;
        }
        return timestampHours;
    })();

    const minutes = (() => {
        const timestampMinutes = timestamp.getMinutes();
        if (timestampMinutes >= 10) return timestampMinutes;
        return `0${timestampMinutes}`
    })();

    const month = (() => {
        const monthsLookup = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        return monthsLookup[(timestamp.getMonth())];
    })();

    const formattedTime = `${hour}:${minutes} ${isAM ? 'AM' : 'PM'} · ${month} ${timestamp.getDate()}`;
    return formattedTime
}

export { formatTime, setClipboard }
