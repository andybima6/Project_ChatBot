(function () {
	const app = document.querySelector(".app");
	const socket = io(); // Inisialisasi koneksi socket.io
  
	let uname;
  
	// Ketika tombol "Join" diklik
	app.querySelector(".join-screen #join-user").addEventListener("click", function () {
	  let username = app.querySelector(".join-screen #username").value;
	  if (username.length == 0) {
		return; // Jika kolom username kosong, tidak melakukan apa-apa
	  }
	  uname = username;
  
	  // Emit event "newuser" ke server dengan username
	  socket.emit("newuser", username);
  
	  // Beralih dari layar join ke layar chat
	  app.querySelector(".join-screen").classList.remove("active");
	  app.querySelector(".chat-screen").classList.add("active");
	});
  
	// Ketika tombol "Exit Chat" diklik
	app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
	  app.querySelector(".join-screen").classList.add("active");
	  app.querySelector(".chat-screen").classList.remove("active");
	});
  
	// Ketika tombol "Send" diklik
	app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
	  let message = app.querySelector(".chat-screen #message-input").value;
	  if (message.length == 0) {
		return; // Jika kolom pesan kosong, tidak melakukan apa-apa
	  }
	  renderMessage("me", {
		username: uname,
		text: message,
	  });
	  // Emit event "prompt" ke server dengan pesan
	  //emit untuk membuatnya sedangkan diindex.js (socket.io) untuk menjalankannya
	  socket.emit("prompt", {
		username: uname,
		text: message,
	  });
	});
  
	// Mendengarkan event "chatbot" dari server
	socket.on("chatbot", function (message) {
	  renderMessage("bot", message);
	});
  
	// Fungsi untuk menampilkan pesan di UI chat
	function renderMessage(type, message) {
	  let messageContainer = app.querySelector(".chat-screen .messages");
	  if (type == "me") {
		// Jika pesan dari pengguna
		let el = document.createElement("div");
		el.setAttribute("class", "message my-message");
		el.innerHTML = `
		  <div>
			<div class="name">${message.username}</div>
			<div class="text">${message.text}</div>
		  </div>
		`;
		messageContainer.appendChild(el);
	  } else if (type == "bot") {
		// Jika pesan dari bot
		let el = document.createElement("div");
		el.setAttribute("class", "message other-message");
		el.innerHTML = `
		  <div>
			<div class="name">${message.username}</div>
			<div class="text">${message.text}</div>
		  </div>
		`;
		messageContainer.appendChild(el);
	  }
	}
  })();
  