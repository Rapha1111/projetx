function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

api='https://projetx.koyeb.app'

id=localStorage.getItem("id")
pswd=localStorage.getItem("pswd")

if (id && pswd){
	document.getElementById("tabbar").classList.add("tabbar")
	document.getElementById("tabbar").hidden=false
    get_self_party()
} else {
	connection()
}

page=document.getElementById("page")
    

function get_self_party(){
	page.innerHTML="loading..."
	img=["invit.png", "link.png", "fri.png", "ff.png", "x.png"]
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/get_self_party?user_id='+id+'&user_password='+pswd, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="Bad Auth"){
			localStorage.setItem("id", "")
			localStorage.setItem("pswd", "")
			document.getElementById("tabbar").classList.remove("tabbar")
			document.getElementById("tabbar").hidden=true
			page.innerHTML=`<p>Mot de passe incorect, <a href="javascript:window.location.reload()">Se conecter</a></p>`
		} else {
		data=JSON.parse(xhr.responseText);
		if (data.length==0){
			page.innerHTML="<p>Vous n'est pas encore inscrit a une fête</p>"
		} else {
		r=""
		a=0
		for (let i in data) {
			if (data.hasOwnProperty(i)) {  
				d=data[i]
				r+=`<div onclick="affiche_party(`+d["id"]+`)" class="party_container" style="top: `+a*135+`px">
        <div class="img_party">
            <img src="img/`+img[d["type"]]+`">
        </div>
        <div class="details">
            <div>`+d["name"]+`</div>
            <div>`+d["nbr_member"]+` personnes</div>
        </div>
    </div><br>`
			a++
		}
    }
	page.innerHTML=r+`<div class="end_page" style="top:`+a*135+`px">Made by Rapha1111</div>`

}}
	}};
xhr.send();
}

function connection(ok=false){
	page.innerHTML=`<p style="top:0px">Nom :</p>
	<input style="top:40px" placeholder="Nom d'utilisateur" type=text id=nom>
	<p style="top:50px">Mot de passe :</p>
	<input style="top:90px" placeholder="Mot de passe" type=password id=mdp>
	<input type=button value="Valider" onclick="connect()" style="top:120px" class=btn>
	<input type=button value="Se créer un compte" onclick="new_account()" style="top:190px" class=btn>`
	if (ok){
		page.innerHTML+=`<p style="top:150px; color:red">Mot de passe incorrect</p>`
	}
}

function connect(){
	nom=document.getElementById("nom").value
	mdp=document.getElementById("mdp").value
	page.innerHTML="loading..."
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/get_id?user_name='+nom+'&user_password='+mdp, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="None"){
			connection(true)
    } else {
		localStorage.setItem("id", xhr.responseText)
		localStorage.setItem("pswd", mdp)
		pswd=mdp
		id=xhr.responseText
		document.getElementById("tabbar").classList.add("tabbar")
		document.getElementById("tabbar").hidden=false
		get_self_party()
	}
}
}
xhr.send();
};

function new_account(ok){
	page.innerHTML=`<p style="top:0px">Nom :</p>
	<input style="top:40px" placeholder="Nom d'utilisateur" type=text id=nom>
	<p style="top:50px">Mot de passe :</p>
	<input style="top:90px" placeholder="Mot de passe" type=password id=mdp>
	<p style="top:100px">Année de naissance :</p>
	<input style="top:140px" placeholder="2000" type=number id=birth min="1900" max="2050">
	<p style="top:150px">Pseudo insta :</p>
	<input style="top:190px" placeholder="example" type=text id=insta>
	<p style="top:200px">Situation sentimentale :</p>
	<select style="top:240px" name="situation" id="situation">
  <option value="0">Abstinance</option>
  <option value="1">Recherche sérieux</option>
  <option value="2">Flirt</option>
  <option value="3">Plan Q</option>
  <option value="4">En couple</option></select>
  	<p style="top:250px">Description :</p>
	<textarea style="top: 290px; height: 130px;" id=desc></textarea>
</select>

	<input type=button value="Créer un compte" onclick="make_account()" style="top:450px" class=btn>
	<input type=button value="Se connecter" onclick="connection()" style="top:500px" class=btn>`
	if (ok){
		page.innerHTML+=`<p style="top:150px; color:red">Mot de passe incorrect</p>`
	}
}

function make_account(){
	nom=document.getElementById("nom").value
	mdp=document.getElementById("mdp").value
	insta=document.getElementById("insta").value
	birth=document.getElementById("birth").value
	situation=document.getElementById("situation").value
	desc=document.getElementById("desc").value
	page.innerHTML="loading..."
	var xhr = new XMLHttpRequest();
xhr.open('POST', api+'/new_member', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="None"){
			connection(true)
    } else {
		localStorage.setItem("id", xhr.responseText)
		localStorage.setItem("pswd", mdp)
		pswd=mdp
		id=xhr.responseText
		document.getElementById("tabbar").classList.add("tabbar")
		document.getElementById("tabbar").hidden=false
		get_self_party()
	}
}
}
data=JSON.stringify({
	name:nom,
	password:mdp,
	description:desc,
	birth_year:birth,
	situation:situation,
	insta:insta
})
xhr.send(data);
}

function menu_plus(){
	page.innerHTML=""
	page.innerHTML=`
	<input type="button" value="Créer une fête" style="top:0px" class=btn onclick="make_party_page()">
	<input type="button" value="Rechercher des fêtes accessibles" style="top:30px" class=btn onclick="find_party_page()">
	<p style="top:50px">Fêtes auxquelles vous êtes invités :</p>
	`
	img=["invit.png", "link.png", "fri.png", "ff.png", "x.png"]
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/get_self_invited_at?user_id='+id+'&user_password='+pswd, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="Bad Auth"){
			localStorage.setItem("id", "")
			localStorage.setItem("pswd", "")
			document.getElementById("tabbar").classList.remove("tabbar")
			document.getElementById("tabbar").hidden=true
			page.innerHTML=`<p>Mot de passe incorect, <a href="javascript:window.location.reload()">Se conecter</a></p>`
		} else {
		data=JSON.parse(xhr.responseText);
		if (data.length==0){
			page.innerHTML+=`<p style="top:80px">Vous n'êtes invités a aucune fête</p>`
		} else {
		r=""
		a=0
		for (let i in data) {
			if (data.hasOwnProperty(i)) {  
				d=data[i]
				r+=`<div onclick="affiche_party(`+d["id"]+`)" class="party_container" style="top: `+((a*135)+90)+`px">
        <div class="img_party">
            <img src="img/`+img[d["type"]]+`">
        </div>
        <div class="details">
            <div>`+d["name"]+`</div>
            <div>`+d["nbr_member"]+` personnes</div>
			<div>créée par `+d["owner_name"]+`</div>
        </div>
    </div><br>`
			a++
		}
    }
page.innerHTML+=r+`<div class="end_page" style="top:`+((a*135)+90)+`px">Made by Rapha1111</div>`
}}
	
}};
xhr.send();
}

function affiche_party(party_id){
	page.innerHTML="loading party data..."
	img=["Sur invitation", "Rejoingnable par lien", "Que pour les amis", "Pour les amis et amis d'amis", "PROJET X"]
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/get_party?party_id='+party_id+'&user_id='+id+'&user_password='+pswd, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="Bad Auth"){
			localStorage.setItem("id", "")
			localStorage.setItem("pswd", "")
			document.getElementById("tabbar").classList.remove("tabbar")
			document.getElementById("tabbar").hidden=true
			page.innerHTML=`<p>Mot de passe incorect, <a href="javascript:window.location.reload()">Se conecter</a></p>`
		} else if (xhr.responseText=="Non"){
			page.innerHTML=`<p>Vous n'avez pas accès a cette party</p>`
		} else {
		d=JSON.parse(xhr.responseText);
		
		
		
		r=`<div class="party_container_xl" style="top: 10px">
        <div class="details">
            <div><h2>`+d["name"]+`</h2></div>
            <div>`+d["location"]+`</div>
			<div>`+img[d["type"]]+`</div>
			<div>créée par <a href="javascript:affiche_user(`+d["owner"]["id"]+`)">`+d["owner"]["name"]+`</a></div>
			<br>
			<div>`+d["description"]+`</div><br>
			<div>`+d["nbr_members"]+` personnes / `+d["max_members"]+`</div>
			<div>Alcool : `+["NON", "OUI"][d["alcool"]]+`</div>
			<div>Bracelets : `+["NON", "OUI"][d["situation_color"]]+`</div>
		`
		if (d["accepted_birth_year"].length>0){
			r+=`
			<div>Date de naissance acceptée : `+d["accepted_birth_year"].join(", ")+`</div>
			`
		}
		r+=`
		<br>
		<input type=button class=party_btn value="afficher les participants" onclick="affiche_party_member(`+d["id"]+`)">
		`
		if (d["join_state"]==1){
			r+=`
		<input type=button class=party_btn value="Rejoindre" onclick="join_party(`+d["id"]+`)">
		`
		} else if (d["join_state"]==-1 && d["can_modify"]==0){
			r+=`
		<input type=button class=party_btn value="Quitter" onclick="quit_party(`+d["id"]+`)">
		`
		}
		if (d["can_modify"]==1){
			r+=`
		<input type=button class=party_btn value="Modifier" onclick="edit_party_page(`+party_id+`)">
		<br>
		<input type=button class=party_btn value="Supprimer" onclick="delete_party(`+party_id+`)">
		`
		}
		
		r+=`</div></div><br>`
	page.innerHTML=r
    }
	
}};
xhr.send();
}

function join_party(party_id){
	
	page.innerHTML="loading..."
	var xhr = new XMLHttpRequest();
xhr.open('POST', api+'/join_party', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
       get_self_party()
}
}
data=JSON.stringify({
	user_id:id,
	user_password:pswd,
	party_id:party_id
})
xhr.send(data);
}

function quit_party(party_id){
	
	page.innerHTML="loading..."
	var xhr = new XMLHttpRequest();
xhr.open('POST', api+'/quit_party', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
       get_self_party()
}
}
data=JSON.stringify({
	user_id:id,
	user_password:pswd,
	party_id:party_id
})
xhr.send(data);
}

function delete_party(party_id){
	
	page.innerHTML="loading..."
	var xhr = new XMLHttpRequest();
xhr.open('POST', api+'/delete_party', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
       get_self_party()
}
}
data=JSON.stringify({
	user_id:id,
	user_password:pswd,
	party_id:party_id
})
xhr.send(data);
}

function make_party_page(ok=false){
	page.innerHTML=`<p style="top:0px">Titre :</p>
	<input style="top:40px" placeholder="Titre de la fête" type=text id=nom>
	<p style="top:50px">Description :</p>
	<textarea style="top: 90px; height: 130px;" id=desc></textarea>
	<p style="top:220px">Nombre max de personne :</p>
	<input style="top:260px" placeholder="100" type=number id=nbr>
	<p style="top:270px">Année de naissance acceptés (séparés par des espaces) :</p>
	<input style="top:330px" placeholder="2000 2001 2002" type=text id=birth min="1900" max="2050">
	<p style="top:340px">Code postal de la ville de la fête</p>
	<input style="top:380px" placeholder="75001" type=number id=postal>
	<p style="top:390px">Type de fête :</p>
	<select style="top:430px" id="type">
	<option value="0">Sur invitation</option>
	<option value="1">Joignable par lien</option>
	<option value="2">Ouvert aux amis</option>
	<option value="3">Ouvert aux amis et amis d'ami</option>
	<option value="4">PROJET X</option></select>
	</select>
	<p style="top:440px">Alcool :</p>
	<input style="top:480px" type=checkbox id=alcool>
	<p style="top:490px">Bracelet de situation amoureuse :</p>
	<input style="top:530px" type=checkbox id=situation>
	<input type=button value="Créer" onclick="new_party()" style="top:570px" class=btn>
	<div class="end_page" style="top:620px">Made by Rapha1111</div>`
	if (ok){
		page.innerHTML+=`<p style="top:150px; color:red">Mot de passe incorrect</p>`
	}
}

function new_party(){
	nom=document.getElementById("nom").value
	desc=document.getElementById("desc").value
	nbr=document.getElementById("nbr").value
	birth=document.getElementById("birth").value.split(" ")
	type=document.getElementById("type").value
	alcool=document.getElementById("alcool").checked ? 1 : 0
	situation=document.getElementById("situation").checked ? 1 : 0
	postal=document.getElementById("postal").value
	birth_acc=[]
	console.log(birth)
	if (birth == [""]){
	birth_acc="[]"
	} else {
	for (let i in birth) {
		if (birth.hasOwnProperty(i)) {  
			birth_acc.push(parseInt(birth[i]))
	}

}
birth_acc=JSON.stringify(birth_acc)
}
page.innerHTML="loading..."
var xhr = new XMLHttpRequest();
xhr.open('POST', api+'/new_party', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
		get_self_party()
}
}
data=JSON.stringify({
	user_id:id,
	user_password:pswd,
	name:nom,
	description:desc,
	alcool:alcool,
	max_members:nbr,
	situation_color:situation,
	type:type,
	location:parseInt(postal),
	birth_year:birth_acc
})
xhr.send(data);
	
}

function affiche_user(user_id){
	page.innerHTML="loading member data..."
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/get_member?user_id='+user_id+'&sender_id='+id+'&sender_password='+pswd, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="Bad Auth"){
			localStorage.setItem("id", "")
			localStorage.setItem("pswd", "")
			document.getElementById("tabbar").classList.remove("tabbar")
			document.getElementById("tabbar").hidden=true
			page.innerHTML=`<p>Mot de passe incorect, <a href="javascript:window.location.reload()">Se conecter</a></p>`
		} else if (xhr.responseText=="Non"){
			page.innerHTML=`<p>Vous n'avez pas accès a cette party</p>`
		} else {
		d=JSON.parse(xhr.responseText);
		
		
		
		r=`<div class="party_container_xl" style="top: 10px">
        <div class="details">
            <div><h2>`+d["name"]+`</h2></div>
			<div>né en `+d["birth_year"]+`</div>
			<div>Instagram : <a href="https://instagram.com/`+d["insta"]+`/" target=_blank>`+d["insta"]+`</a></div>
			<br>
			<div>`+d["description"]+`</div><br>
			`
		
		r+=`
		<br>
		`
		if (d["is_friend"]==0){
			r+=`<input type=button class=party_btn value="Demander en amis" onclick="ask_friend(`+d["id"]+`)">`
		} else if (d["is_friend"]==2){
			r+=`<input type=button class=party_btn value="Accepter la demande d'amis" onclick="accept_friend(`+d["id"]+`)"><input type=button class=party_btn value="Refuser la demande d'amis" onclick="refuse_friend(`+d["id"]+`)">`
		} else {
			r+=`<input type=button class=party_btn value="Ne plus être amis" onclick="remove_friend(`+d["id"]+`)">`
		
		}
		
		r+=`</div></div><br>`
	page.innerHTML=r
    }
	
}};
xhr.send();
}

function affiche_party_member(party_id){
	page.innerHTML="loading party member data..."
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/get_party_members?party_id='+party_id+'&user_id='+id+'&user_password='+pswd, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="Bad Auth"){
			localStorage.setItem("id", "")
			localStorage.setItem("pswd", "")
			document.getElementById("tabbar").classList.remove("tabbar")
			document.getElementById("tabbar").hidden=true
			page.innerHTML=`<p>Mot de passe incorect, <a href="javascript:window.location.reload()">Se conecter</a></p>`
		} else if (xhr.responseText=="Non"){
			page.innerHTML=`<p>Vous n'avez pas accès a cette party</p>`
		} else {
		d=JSON.parse(xhr.responseText);
		r=`<div class="party_container_xl" style="top: 10px">
        <div class="details">`
		if (d["can_invite"]){
			r+=`<input type=button class=party_btn value="Inviter" onclick="invite_page(`+party_id+`)">`
		}
		r+=`<h2>Membres de la fête</h2><ul>`
		for (let i in d["members"]) {
			if (d["members"].hasOwnProperty(i)) {  
				r+=`<li><a href="javascript:affiche_user(`+d["members"][i]["id"]+`)">`+d["members"][i]["name"]+`</a></li>`
		}
		}
		r+=`</ul><h2>Membres invités</h2><ul>`
		for (let i in d["invited"]) {
			if (d["invited"].hasOwnProperty(i)) {  
				r+=`<li><a href="javascript:affiche_user(`+d["invited"][i]["id"]+`)">`+d["invited"][i]["name"]+`</a></li>`
		}
		}
		r+=`</ul></div></div><br>`
	page.innerHTML=r
    }
	
}};
xhr.send();
}

function ask_friend(u_id){
page.innerHTML="loading..."
var xhr = new XMLHttpRequest();
xhr.open('POST', api+'/add_friend', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
		page.innerHTML="demande envoyée !"
}
}
data=JSON.stringify({
	user_id:id,
	user_password:pswd,
	friend_id:u_id
})
xhr.send(data);
}

function accept_friend(u_id){
	page.innerHTML="loading..."
	var xhr = new XMLHttpRequest();
	xhr.open('POST', api+'/accept_friend', true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			page.innerHTML="accepté !"
	}
	}
	data=JSON.stringify({
		user_id:id,
		user_password:pswd,
		friend_id:u_id
	})
	xhr.send(data);
}

function refuse_friend(u_id){
	page.innerHTML="loading..."
	var xhr = new XMLHttpRequest();
	xhr.open('POST', api+'/refuse_friend', true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			page.innerHTML="refusé !"
	}
	}
	data=JSON.stringify({
		user_id:id,
		user_password:pswd,
		friend_id:u_id
	})
	xhr.send(data);
}

function remove_friend(u_id){
	page.innerHTML="loading..."
	var xhr = new XMLHttpRequest();
	xhr.open('POST', api+'/remove_friend', true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			page.innerHTML="ami retiré !"
	}
	}
	data=JSON.stringify({
		user_id:id,
		user_password:pswd,
		friend_id:u_id
	})
	xhr.send(data);
}
function deco(){
	localStorage.setItem("id", "")
	localStorage.setItem("pswd", "")
	document.getElementById("tabbar").classList.remove("tabbar")
	document.getElementById("tabbar").hidden=true
	page.innerHTML=`<p>Déconnecté, <a href="javascript:window.location.reload()">Se conecter</a></p>`
}

function menu_perso(){
	page.innerHTML=`
	<input type=button class=btn value="Se déconnecter" onclick="deco()" style="top:0px">
	<input type=button class=btn value="Modifier mon compte" onclick="edit_account_page()" style="top:30px">
	`
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/get_self_friend?user_id='+id+'&user_password='+pswd, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="Bad Auth"){
			localStorage.setItem("id", "")
			localStorage.setItem("pswd", "")
			document.getElementById("tabbar").classList.remove("tabbar")
			document.getElementById("tabbar").hidden=true
			page.innerHTML=`<p>Mot de passe incorect, <a href="javascript:window.location.reload()">Se conecter</a></p>`
		} else {
		d=JSON.parse(xhr.responseText);
		a=80
		r=`<h2 style="top: 40px" class=floating>Demandes d'amis :</h2>`
		for (let i in d["request"]) {
			if (d["request"].hasOwnProperty(i)) {  
				r+=`<p class=floating style="top:`+a+`px"><a href="javascript:affiche_user(`+d["request"][i]["id"]+`)">`+d["request"][i]["name"]+`</a></p>`
				a+=20
		}
		}
		a+=50
		r+=`<h2 class=floating style="top:`+a+`px">Amis :</h2>`
		a+=40
		for (let i in d["friend"]) {
			if (d["friend"].hasOwnProperty(i)) {  
				r+=`<p class=floating style="top:`+a+`px"><a href="javascript:affiche_user(`+d["friend"][i]["id"]+`)">`+d["friend"][i]["name"]+`</a></p>`
				a+=20
		}
		}
		r+=``
	page.innerHTML+=r
    }
	
}};
xhr.send();
}

function edit_party_page(party_id){
	page.innerHTML="loading party data..."
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/get_party?party_id='+party_id+'&user_id='+id+'&user_password='+pswd, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="Bad Auth"){
			localStorage.setItem("id", "")
			localStorage.setItem("pswd", "")
			document.getElementById("tabbar").classList.remove("tabbar")
			document.getElementById("tabbar").hidden=true
			page.innerHTML=`<p>Mot de passe incorect, <a href="javascript:window.location.reload()">Se conecter</a></p>`
		} else if (xhr.responseText=="Non"){
			page.innerHTML=`<p>Vous n'avez pas accès a cette party</p>`
		} else {
		d=JSON.parse(xhr.responseText);
		page.innerHTML=`<p style="top:0px">Titre :</p>
	<input style="top:40px" placeholder="Titre de la fête" type=text id=nom value="`+d["name"]+`">
	<p style="top:50px">Description :</p>
	<textarea style="top: 90px; height: 130px;" id=desc>`+d["description"]+`</textarea>
	<p style="top:220px">Nombre max de personne :</p>
	<input style="top:260px" placeholder="100" type=number id=nbr value="`+d["max_members"]+`">
	<p style="top:270px">Année de naissance acceptés (séparés par des espaces) :</p>
	<input style="top:330px" placeholder="2000 2001 2002" type=text id=birth min="1900" max="2050" value="`+d["accepted_birth_year"].join(" ")+`">
	<p style="top:340px">Code postal de la ville de la fête</p>
	<input style="top:380px" placeholder="75001" type=number id=postal value="`+d["location"]+`">
	<p style="top:390px">Type de fête :</p>
	<select style="top:430px" id="type">
	<option value="0">Sur invitation</option>
	<option value="1">Joignable par lien</option>
	<option value="2">Ouvert aux amis</option>
	<option value="3">Ouvert aux amis et amis d'ami</option>
	<option value="4">PROJET X</option></select>
	</select>
	<p style="top:440px">Alcool :</p>
	<input style="top:480px" type=checkbox id=alcool>
	<p style="top:490px">Bracelet de situation amoureuse :</p>
	<input style="top:530px" type=checkbox id=situation>
	<input type=button value="Modifier" onclick="edit_party(`+party_id+`)" style="top:570px" class=btn>
	<div class="end_page" style="top:620px">Made by Rapha1111</div>`
	document.getElementById("type").value=d["type"]
	if (d["alcool"]){
		document.getElementById("alcool").checked=true
	}
	if (d["situation_color"]){
		document.getElementById("situation").checked=true
	}
    }
	
}};
xhr.send();	
}

function edit_party(party_id){
	nom=document.getElementById("nom").value
	desc=document.getElementById("desc").value
	nbr=document.getElementById("nbr").value
	birth=document.getElementById("birth").value.split(" ")
	type=document.getElementById("type").value
	alcool=document.getElementById("alcool").checked ? 1 : 0
	situation=document.getElementById("situation").checked ? 1 : 0
	postal=document.getElementById("postal").value
	birth_acc=[]
	for (let i in birth) {
		if (birth.hasOwnProperty(i)) {  
			birth_acc.push(parseInt(birth[i]))
	}
}
page.innerHTML="edition en cours..."
var xhr = new XMLHttpRequest();
xhr.open('POST', api+'/edit_party', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
		affiche_party(party_id)
}
}
data=JSON.stringify({
	user_id:id,
	user_password:pswd,
	name:nom,
	description:desc,
	alcool:alcool,
	max_members:nbr,
	situation_color:situation,
	type:type,
	location:parseInt(postal),
	accepted_birth_year:JSON.stringify(birth_acc),
	party_id:party_id
})
xhr.send(data);
	
}

function invite_page(p_id, q=null){
	page.innerHTML=`
	<input style="top:20px" placeholder="Chercher un pseudo" type=text id=nom>
	<input style="top:40px" value="Rechercher" type=button onclick="invite_page(`+p_id+`, document.getElementById('nom').value)" class=btn>
	`
	if (q){
	


		var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/search_member?q='+q, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        a=50
		d=JSON.parse(xhr.responseText);
		for (let i in d) {
			if (d.hasOwnProperty(i)) {  
				page.innerHTML+=`<p style="top:`+a+`px"><a href="javascript:invite(`+d[i]["id"]+`, `+p_id+`)">`+d[i]["name"]+`</a></p>`
				a+=20
		}
    }
	
};

}
xhr.send();	
}}

function invite(u_id, p_id){
	page.innerHTML="invitation en cours..."
	var xhr = new XMLHttpRequest();
	xhr.open('POST', api+'/invite', true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			affiche_party_member(p_id)
	}
	}
	data=JSON.stringify({
		user_id:id,
		user_password:pswd,
		invited_id:u_id,
		party_id:p_id
	})
	xhr.send(data);
}

function edit_account_page(){
	page.innerHTML="loading personal datas..."
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/get_member?user_id='+id+'&sender_id='+id+'&sender_password='+pswd, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="Bad Auth"){
			localStorage.setItem("id", "")
			localStorage.setItem("pswd", "")
			document.getElementById("tabbar").classList.remove("tabbar")
			document.getElementById("tabbar").hidden=true
			page.innerHTML=`<p>Mot de passe incorect, <a href="javascript:window.location.reload()">Se conecter</a></p>`
		} else {
		d=JSON.parse(xhr.responseText);
		page.innerHTML=`<p style="top:0px">Nom :</p>
	<input style="top:40px" placeholder="Nom d'utilisateur" type=text id=nom value="`+d["name"]+`">
	<p style="top:50px">Mot de passe :</p>
	<input style="top:90px" placeholder="Mot de passe" type=password id=mdp value="`+pswd+`">
	<p style="top:100px">Année de naissance :</p>
	<input style="top:140px" placeholder="2000" type=number id=birth min="1900" max="2050" value="`+d["birth_year"]+`">
	<p style="top:150px">Pseudo insta :</p>
	<input style="top:190px" placeholder="example" type=text id=insta value="`+d["insta"]+`">
	<p style="top:200px">Situation sentimentale :</p>
	<select style="top:240px" name="situation" id="situation">
  <option value="0">Abstinance</option>
  <option value="1">Recherche sérieux</option>
  <option value="2">Flirt</option>
  <option value="3">Plan Q</option>
  <option value="4">En couple</option></select>
  	<p style="top:250px">Description :</p>
	<textarea style="top: 290px; height: 130px;" id=desc>`+d["description"]+`</textarea>
</select>

	<input type=button value="Mettre a jour" onclick="edit_account()" style="top:450px" class=btn>
	<div class="end_page" style="top:620px">Made by Rapha1111</div>`
	document.getElementById("situation").value=d["situation"]
    }
	
}};
xhr.send();	
}


function edit_account(){
	nom=document.getElementById("nom").value
	mdp=document.getElementById("mdp").value
	insta=document.getElementById("insta").value
	birth=document.getElementById("birth").value
	situation=document.getElementById("situation").value
	desc=document.getElementById("desc").value
	page.innerHTML="loading..."
	var xhr = new XMLHttpRequest();
xhr.open('POST', api+'/edit_member', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="None"){
			connection(true)
    } else {
		localStorage.setItem("pswd", mdp)
		pswd=mdp
		menu_perso()
		}
}
}
data=JSON.stringify({
	new_name:nom,
	new_password:mdp,
	description:desc,
	birth_year:birth,
	situation:situation,
	insta:insta,
	user_id:id,
	user_password:pswd
})
xhr.send(data);
}

function find_party(dep){
	page.innerHTML="loading..."
	img=["invit.png", "link.png", "fri.png", "ff.png", "x.png"]
	var xhr = new XMLHttpRequest();
xhr.open('GET', api+'/find_party?user_id='+id+'&user_password='+pswd+"&dep="+dep, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText=="Bad Auth"){
			localStorage.setItem("id", "")
			localStorage.setItem("pswd", "")
			document.getElementById("tabbar").classList.remove("tabbar")
			document.getElementById("tabbar").hidden=true
			page.innerHTML=`<p>Mot de passe incorect, <a href="javascript:window.location.reload()">Se conecter</a></p>`
		} else {
		data=JSON.parse(xhr.responseText);
		if (data.length==0){
			page.innerHTML="<p>Aucune fête dispo ici</p>"
		} else {
		a=30
		r="<p>Fêtes joignables :</p>"
		for (let i in data) {
			if (data.hasOwnProperty(i)) {  
				d=data[i]
				r+=`<div onclick="affiche_party(`+d["id"]+`)" class="party_container" style="top: `+a+`px">
        <div class="img_party">
            <img src="img/`+img[d["type"]]+`">
        </div>
        <div class="details">
            <div>`+d["name"]+`</div>
            <div>`+d["nbr_member"]+` personnes</div>
        </div>
    </div><br>`
			a+=135
		}
    }
	page.innerHTML=r+`<div class="end_page" style="top:`+a+`px">Made by Rapha1111</div>`

}}
	}};
xhr.send();
}


function find_party_page(){
	page.innerHTML=`<p style="top:0px">Votre code de département :</p>
	<input style="top:40px" placeholder="75" type=number min="1" max="99" id=postal>
	<input type=button value="Chercher des fêtes a proximité" onclick="find_party(document.getElementById('postal').value)" style="top:80px" class=btn>
	`
}