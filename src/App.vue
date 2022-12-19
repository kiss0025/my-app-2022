<style scoped>  
.fixed-bar {  
  position: sticky;  
  position: -webkit-sticky; /* for Safari */  
  top: 0em;  
  z-index: 2;  
}  
</style>  
<template>  
  <v-app>  
    <!-- 툴바에 제목, 버튼을 삽입 -->  
    <v-app-bar class="fixed-bar" color="green" dark>  
      <v-app-bar-nav-icon></v-app-bar-nav-icon>  
      <v-toolbar-title>통신점검지침서</v-toolbar-title>  
      <v-spacer></v-spacer>  
      <v-btn icon>  
        <v-icon>more_vert</v-icon>  
      </v-btn>  
    </v-app-bar>  
    <v-content>  
      <!-- 카드 그리드 사이에 여백 설정-->  
      <v-container>  
        <v-row>  
          <!-- 기기별로 그리드의 크기 설정-->  
          <v-col cols="12">  
            <v-card style="width: 100%" height="100">  
              <v-card-title>2020년 12월 4일 (일) 주간 A / 야간 B</v-card-title>  
              2020년 12월 4일 (일) 주간 A / 야간 B  
            </v-card>  
          </v-col>  
          <div> 
            <v-slide-x-transition mode="out-in">  
              <router-view></router-view>  
            </v-slide-x-transition>  
          </div> 
          <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="item in this.aPictures" :key=item.key>  
            <!-- 카드 UI에 사진 담아내기-->  
            <v-card height="330px">  
              <v-img :src="item.url" height="200">  
              </v-img>  
              <v-card-title>  
                <h1 class="title grey--text text--darken-3   
                  mb-3">{{item.title}}</h1>  
                <p class="body-2 grey--text">{{item.info}}</p>  
              </v-card-title>  
            </v-card>  
          </v-col>  
        </v-row>  
    </v-container> 
  </v-content>  
  </v-app>  
</template>  
<script>  
  // 사진 정보(JSON 파일) 읽어오기  
  import oPictureData from '@/datasources/picture-data'  
  export default {  
    data() {  
      return {  
        // aPictures의 배열에 사진 정보 저장하기  
        'aPictures': oPictureData.aPictures  
      }  
    },  
    name: 'App',  
  }  
</script>