Vue.component("modal", {
	template:`<transition name="modal">
		<div class="modal-mask" id="modal-login">
			<div class="modal-wrapper">
				<div class="modal-container">
					<label for="username">用户名:</label>
					<input type="text" id="username" v-model="name">
					<label for="passwd">密码:</label>
					<input type="password" id="passwd" v-model="password">
					<div class="btn-set">
						<button class="modal-btn login" v-on:click="login()">确定</button>
						<button class="modal-btn login" v-on:click="closeModal()">取消</button>
					</div>
				</div>
			</div>
		</div>
	</transition>`,
	data() {
		return {
			name: '',
			password: ''
		};
	},
	methods:{
		closeModal() {
			this.$emit("close");
		},
		login() {
			$.ajax({
				url: 'http://localhost:3000/login/',
				type: 'POST',
				data: {
					name: this.name,
					password: this.password
				},
				withCredentials: true,
				success:(res) => {
					bus.$emit("haslogin")
					this.closeModal();
				}
			})
		}
	}
})

let bus = new Vue({

});
var blogHeader = new Vue({
	el:'.blog-header',
	methods: {
		modal() {
			modal.showModal = true;
		}
	},
	components: {
		"blogHeader": {
			template:'<div><h1 class="cusFont">Coma\'s<slot></slot></h1><p class="cusFont">“ 疼痛有益，先生。 ”</p><button class="login" v-on:click="modalDisplay()" v-if="!haslogin">登录以发表文章</button><button class="login" v-if="haslogin" v-on:click="postPassage()">发表文章</button></div>',
			methods: {
				modalDisplay() {
					this.$emit("openmodal");
				},
				postPassage() {
					console.log(1);
					window.location.href = "http://localhost:3000/index/post/";
				}
			},
			data() {
				return {
					haslogin: false
				}
			},
			created() {
				bus.$on("haslogin", () => {
					this.haslogin = true;
				});
			}
		}
	},
});
let modal = new Vue({
	el: '#modal-s',
	data: {
		showModal: false
	},
	methods: {
		hideModal() {
			this.showModal = false;
		}
	}
});
var article = new Vue({
	el:'#article-show',
	data:{
		articles:[]
	},
	components:{
		'passage-display':{
			props:['article'],
			data:function(){
				return {
					isToggle:false
				}
			},
			filters:{
				shortify:function(value){
					value = value.toString();
					if(!this.isToggle){
						if(value.length > 50){
							return value.slice(0, 51) + '...';
						}
						return value;
					}
					return value;
				}
			},
			template:'<div class="single-article"><a class="article-header" v-bind:href="article.link">{{ article.header }}</a><span class="cusFont">{{article.timeStamp | timeStampFormat}}</span></div>',
			methods:{
				toggle:function(){
					this.isToggle = !this.isToggle;
					if(this.isToggle){
						this.$emit('toggled')
					}
					else{
						this.$emit('untoggled');
					}
				},
			},
			filters:{
				timeStampFormat(value){
					return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
				}
			}
		}
	},
	methods:{
		toggleShow:function(index){
			var art = this.articles[index];
			for(var i in art.paras){
				art.paras[i].isFirst = art.paras[i].isFirst || true;
			}
		},
		untoggleShow:function(index){
			var art = this.articles[index];
			for(var i = 1;i < art.paras.length;i ++){
					art.paras[i].isFirst = false;
			}
		}
	}
});

var getMore = new Vue({
	el:'#get-more',
	data:{
		offset:5
	},
	methods:{
		getmore:function(){
			var src = 'http://localhost:3000/article/newest/?offset=' + String(this.offset);
			var that = this;
			var jsonRes = $.ajax({
				type:'GET',
				url:src,
				dataType:"json",
				success:function(){
					var o = JSON.parse(jsonRes.responseText);
					for(var i in o){
						article.articles.push(o[i]);
					}
					that.offset += 5;
				},
				error:function(XMLHttpRequest){
					var btn = document.getElementById("get-article");
					if(XMLHttpRequest.status == 404){
						btn.innerText = "没有更多了..";
						btn.disabled = true;
					}
				}
			});
		}
	}
});

(function(){
	var jsonRes = $.ajax({
		type:'GET',
		url:'http://localhost:3000/article/newest/?offset=0',
		dataType:"json",
		success:function(){
			var o = JSON.parse(jsonRes.responseText);
			for(var i in o){
				article.articles.push(o[i]);
			}
			$.ajax({
				url: 'http://localhost:3000/login/',
				type: 'POST',
				withCredentials: true,
				success() {
					bus.$emit("haslogin");
				}
			})
		}
	});
})();


