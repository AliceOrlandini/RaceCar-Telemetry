/**
 * This file contains the function that creates the section that displays 
 * the information of the bags that the server has in its filesystem in the form of a table. 
 * In addition, clicking on the download button allows you to download the 
 * corresponding bag from the server.
 */

function createBagsDownloadDialog(charts_page_content) {

  // creating the div that will contain the data received from the server
  let bags_download_container = document.createElement('div')
  bags_download_container.id = 'bags_download_container'
  bags_download_container.classList.add('h-fit', 'mt-5', 'bg-white', 'shadow-xl', 'rounded-md', 'p-5', 'dark:bg-gray-2')
  charts_page_content.appendChild(bags_download_container)

  // creating the title
  let title = document.createElement('h1')
  title.textContent = 'Bag disponibili per il download:'
  title.classList.add('font-formula1', 'text-primary-color', 'mb-4')
  bags_download_container.appendChild(title)

  // creating the table
  let table = document.createElement('table')
  table.classList.add('border-separate', 'border-spacing-y-4', 'font-formula1')
  let thead = document.createElement('thead')
  thead.classList.add('text-center', 'text-base', 'text-gray-800', 'dark:text-white')

  let th_id = document.createElement('th')
  th_id.classList.add('font-normal', 'text-left')
  th_id.textContent = 'ID'

  let th_date = document.createElement('th')
  th_date.classList.add('font-normal')
  th_date.textContent = 'Date'

  let th_size = document.createElement('th')
  th_size.classList.add('font-normal')
  th_size.textContent = 'Size (KB)'

  let th_download = document.createElement('th')
  th_download.classList.add('font-normal')
  th_download.textContent = 'Download'

  let tbody = document.createElement('tbody')
  tbody.classList.add('font-light', 'text-sm', 'text-center', 'text-gray-700', 'dark:text-gray-3')

  thead.appendChild(th_id)
  thead.appendChild(th_date)
  thead.appendChild(th_size)
  thead.appendChild(th_download)
  table.appendChild(thead)
  table.appendChild(tbody)

  bags_download_container.appendChild(table)

  // request for data to the server
  fetch('/bags_info').then(resp => resp.json()).then(json => {

    json.info.forEach(element => {
      // creating the table row
      let tr = document.createElement('tr')
      let td_id = document.createElement('td')
      td_id.textContent = element.id
  
      let td_date = document.createElement('td')
      td_date.textContent = element.date
  
      let td_size = document.createElement('td')
      td_size.textContent = element.size
  
      // creating the button for downloading the bag
      let download_btn = document.createElement('input')
      download_btn.id = 'download_btn_' + element.id
      download_btn.type = 'button'
      download_btn.value = 'download'
      download_btn.setAttribute('id', element.id)
      download_btn.classList.add('cursor-pointer', 'w-fit', 'bg-green-100', 'hover:bg-green-200', 'py-2', 'px-5', 'text-green-600', 'text-xs', 'rounded', 'shadow-md', 'font-formula1', 'dark:bg-green-700', 'dark:hover:bg-green-600', 'dark:text-white')
      download_btn.onclick = (e) => {
        let arg = e.target.getAttribute('id')
        fetch('/get_bag/' + arg).then(resp => resp.blob()).then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = arg + '.zip';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }).catch(() => showAttenctionAlert('Errore nel download del file'));
      }
  
      tr.appendChild(td_id)
      tr.appendChild(td_date)
      tr.appendChild(td_size)
      tr.appendChild(download_btn)
      tbody.appendChild(tr)
    })
  
    table.classList.add('border-spacing-x-10', 'mx-auto')
  })
}