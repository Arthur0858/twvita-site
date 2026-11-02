document.querySelectorAll("[data-copy-inquiry]").forEach((button) => {
  const field = document.getElementById(button.dataset.copyInquiry);
  const status = document.querySelector("[data-copy-status]");
  if (!field || !status) return;
  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(field.value);
      status.textContent = "已複製，可貼到您使用的信箱；尚未寄出。";
    } catch {
      status.textContent = "無法自動複製，請選取上方文字後手動複製。";
      field.focus();
      field.select();
    }
  });
});