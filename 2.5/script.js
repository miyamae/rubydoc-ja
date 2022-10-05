(function() {
  window.onload = function() {
    const elems = document.getElementsByClassName('highlight')

    let tempDiv = document.createElement('div')

    Array.prototype.forEach.call(elems,
      function(elem) {
        // sample code without caption
        tempDiv.innerHTML = elem.innerHTML
        const caption = tempDiv.getElementsByClassName("caption")[0]
        if (caption) tempDiv.removeChild(caption)

        // textarea for preserving the copy text
        const copyText = document.createElement('textarea')
        copyText.setAttribute('class', 'highlight__copy-text')
        copyText.innerHTML = tempDiv.textContent.replace(/^\n+/, "").replace(/\n{2,}$/, "\n")
        elem.appendChild(copyText)

        // COPY button
        const btn = document.createElement('span')
        btn.setAttribute('class', 'highlight__copy-button')
        elem.insertBefore(btn, elem.firstChild)

        btn.onclick = function(){
          copyText.select()
          document.execCommand("copy")
          btn.classList.add("copied")
          window.setTimeout(function() { btn.classList.remove("copied") }, 1000)
        }
      }
    )
  }
})()
