import jwtDecode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/+esm'

  export async function handleHttpErrors(res) {
    if (!res.ok) {
      const errorResponse = await res.json();
      const error = new Error(errorResponse.message)
      // @ts-ignore
      error.fullResponse = errorResponse
      throw error
    }
    return res.json()
  }

  export async function fetchGetJson(URL, token = null) {
      const headers = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
      const data = await fetch(URL, { headers })
      .then(handleHttpErrors)
      return data;
  }

export async function fetchPostJsonFormData(URL, form, event, token = null) {
  let formElement = /** @type {HTMLFormElement} */ (form);
  event.preventDefault();
  const formData = new FormData(formElement);
  const dataFromForm = {};
  formData.forEach((value, key) => dataFromForm[key] = value);

  let options = {
    method: 'POST',
    body: JSON.stringify(dataFromForm),
    headers: {
      'Content-Type': 'application/json',
    }
  }
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  const addedData = await fetch(URL, options)
   .then(handleHttpErrors);
   return addedData;
}

export async function fetchPutJsonFormData(URL, form, event, token = null) {
  let formElement = /** @type {HTMLFormElement} */ (form);
  event.preventDefault();
  const formData = new FormData(formElement);
  const dataFromForm = {};
  formData.forEach((value, key) => dataFromForm[key] = value);
  console.log(JSON.stringify(dataFromForm))
  let options = {
    method: 'PUT',
    body: JSON.stringify(dataFromForm),
    headers: {
      'Content-Type': 'application/json',
    }
  }
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  const addedData = await fetch(URL, options)
   .then(handleHttpErrors);
   return addedData;
}

export async function fetchDeleteJson(URL, payload = null, token = null) {
    let options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
    if (payload) {
      options.body = JSON.stringify(payload);
    }
    const data = await fetch(URL, options)
    .then(handleHttpErrors)
    return data;
}

export function sanitizeStringWithTableRows(tableRows) {
  // @ts-ignore
  let secureRows = DOMPurify.sanitize("<table>" + tableRows + "</table>")
  secureRows = secureRows.replace("<table>", "").replace("</table>", "")
  return secureRows
}

export function sanitizeStringWithList(list) {
  let secureList = DOMPurify.sanitize("<li>" + list + "</li>")
  secureList = secureList.replace("<li>", "").replace("</li>", "")
  return secureList
}

export function sanitizeStringWithParagraph(p) {
  let secureP = DOMPurify.sanitize("<p>" + p + "</p>")
  secureP = secureP.replace("<p>", "").replace("</p>", "")
  return secureP
}

export function encode(str) {
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  return str;
}
  
export function renderTemplate(template, contentId) {
  const content = document.getElementById(contentId)
  if (!content) {
    throw Error("No Element found for provided content id")
  }
  content.innerHTML = ""
  content.append(template)
}

export async function loadHtml(page) {
  const resHtml = await fetch(page).then(r => {
    if (!r.ok) {
      throw new Error(`Failed to load the page: '${page}' `)
    }
    return r.text()
  });
  const parser = new DOMParser()
  const content = parser.parseFromString(resHtml, "text/html")
  const div = content.querySelector(".template")
  if (!div) {
    throw new Error(`No outer div with class 'template' found in file '${page}'`)
  }
  return div
};

export function adjustForMissingHash() {
  let path = window.location.hash
  if (path == "") { //Do this only for hash
    path = "#/"
    window.history.pushState({}, path, window.location.href + path);
  }
}

export function setActiveLink(topnav, activeUrl) {
  const links = document.getElementById(topnav).querySelectorAll("a");
  links.forEach(child => {
    child.classList.remove("active")
    //remove leading '/' if any
    if (child.getAttribute("href").replace(/\//, "") === activeUrl) {
      child.classList.add("active")
    }
  })
}

export function isLoggedIn() {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  // Check if token is expired
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds
  if (decodedToken.exp < currentTime) {
    // Token is expired
    localStorage.removeItem('token'); // Remove token from local storage
    return false;
  }
  // Token is valid
  return true;
}

export function getLoggedInUsername() {
  const token = localStorage.getItem('token');
  if (!token) {
    return "";
  }
  const decodedToken = jwtDecode(token);
  if (!decodedToken.sub) {
    return "";
  }
  return decodedToken.sub;
}

export function isAdmin() {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  const decodedToken = jwtDecode(token);
  if (!decodedToken.roles) {
    return false;
  }
  return decodedToken.roles.includes('ADMIN');
}

export function toggleLoginLogoutButtons(loggedIn, isAdmin) {
  const adminButton = document.getElementById("adminButton");
  const profileButton = document.getElementById("profileButton");
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");

  adminButton.style.display = isAdmin && loggedIn ? "block" : "none";
  profileButton.style.display = loggedIn ? "block" : "none";
  loginButton.style.display = loggedIn ? "none" : "block";
  logoutButton.style.display = loggedIn ? "block" : "none";

  const username = getLoggedInUsername();
  const profileUrl = `/profile/${username}`;
  profileButton.href = profileUrl;
}