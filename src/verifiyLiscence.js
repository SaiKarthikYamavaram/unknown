const puppeteer = require("puppeteer");

const checker = async (no) => {
	try {
		const browser = await puppeteer.launch({
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		const page = await browser.newPage();
		await page.setDefaultNavigationTimeout(0);
		var value = null;
		await page.goto(
			"https://tgtransport.net/TGCFSTONLINE/Reports/OnlineLicenceSearch.aspx",
			{ waitUntil: "domcontentloaded" }
		);

		await page.evaluate(
			(val) =>
				(document.querySelector("#ctl00_OnlineContent_txtDlNo").value = val),
			no
		);
		// await page.waitForNavigation();

		await page.evaluate(async () => {
			await document.querySelector("#ctl00_OnlineContent_btnGet").click();
		});

		await page.waitForNavigation();
		value = await page.evaluate(async () =>
			Array.from(
				document.querySelector("#ctl00_OnlineContent_gvLic").children[0]
					.children[1].children
			)
				.filter((i) => i.textContent.trim().length !== 0)
				.map((i) => {
					return i.textContent;
				})
		);

		// await page.waitForNavigation();
		await browser.close();

		return value;
	} catch (error) {
		return "Failed To access Values";
	}
};

module.exports = checker;
