var SellixBuyNow;

var SellixProductId;

var SellixModalContainer = document.createElement('div');

SellixModalContainer.innerHTML = `
<div id="sellix-modal" style="display:none; position:fixed; top: 0; left:0; width: 100%; height:100%; z-index:-1050">
	<div id="backdrop" style="background: rgba(228, 231, 234, .1); width:100%; height:100%; position:absolute;">
	</div>
	<div style="top:20px; margin:auto; width: 100%; height:100%; z-index:1">
		<img id="sellix-modal-close" src="https://sellix.io/static/media/x.9247e891.png" style="width:15px;height:15px;position: absolute;top:30px;right:30px; cursor: pointer"/>
	    <div class="sellix-modal-content" style="height: 100%">
	        <iframe src="" style="width:100%;height:100%; border:none; border-radius:5px" id="sellix-iframe">
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
		console.log('~~~~~~~~~~~~~~`', SellixProductId)
		document.getElementById("sellix-iframe").src = "https://sellix.io/payment/embed/"+SellixProductId;
	}
	if (!document.querySelector("[data-sellix-product]")) isProduct=false
	setTimeout(reschedule, 100, isProduct);
},100, false);