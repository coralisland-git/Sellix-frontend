var SellixBuyNow;

var SellixProductId;

var SellixModalContainer = document.createElement('div');

SellixModalContainer.innerHTML = `
<div id="sellix-modal" style="display:none; position:fixed; top: 0; left:0; width: 100%; height:100%; z-index:-1050">
	<div id="backdrop" style="background: black; opacity:0.7; width:100%; height:100%; position:absolute;">
	</div>
	<div style="position:relative; top:20px; margin:auto; width: 30vw; height:85vh">
		<img id="sellix-modal-close" src="https://sellix.io/static/media/x.9247e891.png" style="width:20px;height:20px;position: absolute;border-radius:50%;top:-7px;right:-5px; cursor: pointer;background-color:white;padding:5px"/>
	    <div class="sellix-modal-content" style="height: 100%">
	        <iframe src="http://127.0.0.1:3000/payment/embed/`+SellixProductId+`" style="width:100%;height:100%; border:none; border-radius:10px" id="sellix-iframe">
	    </div>
	</div>
</div>
`;

document.getElementsByTagName("body")[0].appendChild(SellixModalContainer);

var SellixModal = document.getElementById("sellix-modal");

document.getElementById("sellix-modal-close").addEventListener("click", function(){
	SellixModal.style.display = "none"; 
  	SellixModal.style.zIndex = "-1050"; 
})

setTimeout(function reschedule(isProduct) {
	if (document.querySelector("[data-sellix-product]") && !isProduct) {
		SellixBuyNow = document.querySelector("[data-sellix-product]");
		SellixProductId = SellixBuyNow.getAttribute("data-sellix-product");
		SellixBuyNow.addEventListener("click", function(){  
			SellixModal.style.display = "flex"; 
			SellixModal.style.zIndex = "1050"; 
		});
		isProduct = true;
		document.getElementById("sellix-iframe").src = "http://127.0.0.1:3000/payment/embed/"+SellixProductId;
	}
	if (!document.querySelector("[data-sellix-product]")) isProduct=false
	setTimeout(reschedule, 100, isProduct);
},100, false);