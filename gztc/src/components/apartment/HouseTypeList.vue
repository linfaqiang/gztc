<template>
  <div class="housetype-list-page">
    <!--头部-->
    <sub-header :title="title"></sub-header>
    <!--户型列表-->
    <div class="housetype-list">
      <ul>
        <li>
          <a href="javascript:;">
            <div class="list-content">
              <div class="img-item">
                <img src="static/img/recomment/project.jpg" alt="">
              </div>
              <div class="content-item">
                <h4>
                  <span>25㎡独立办公室 <b></b></span>
                </h4>
                <p>
                  <strong>3100</strong> 元/月
                  <span>50 ㎡</span>
                </p>
              </div>
            </div>
            <div class="list-button">
              <button type="button">推&nbsp;&nbsp;荐</button>
              <button type="button">了解详情</button>
            </div>
          </a>
        </li>
        <li>
          <a href="javascript:;">
            <div class="list-content">
              <div class="img-item">
                <img src="static/img/recomment/project.jpg" alt="">
              </div>
              <div class="content-item">
                <h4>
                  <span>25㎡独立办公室 <b></b></span>
                </h4>
                <p>
                  <strong>3100</strong> 元/月
                  <span>50 ㎡</span>
                </p>
              </div>
            </div>
            <div class="list-button">
              <button type="button">推&nbsp;&nbsp;荐</button>
              <button type="button">了解详情</button>
            </div>
          </a>
        </li>
        <li>
          <a href="javascript:;">
            <div class="list-content">
              <div class="img-item">
                <img src="static/img/recomment/project.jpg" alt="">
              </div>
              <div class="content-item">
                <h4>
                  <span>25㎡独立办公室 <b></b></span>
                </h4>
                <p>
                  <strong>3100</strong> 元/月
                  <span>50 ㎡</span>
                </p>
              </div>
            </div>
            <div class="list-button">
              <button type="button">推&nbsp;&nbsp;荐</button>
              <button type="button">了解详情</button>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/common/SubHeader'
export default {
  name: 'HouseTypeList',
  data () {
    return {
      title: '户型列表'
    }
  },
  components: {
    SubHeader
  }
}
</script>
<style scoped>
  .housetype-list{
  padding: 0 .277778rem;
  margin-bottom: .222222rem;
  background-color: #fff;
}
.housetype-list ul{
  padding: .351852rem .148148rem 0 .148148rem;
}
.housetype-list ul li{
  position: relative;
  border-bottom: 1px solid #ccc;
}
.housetype-list ul li:last-child{
  border: 0;
}
.housetype-list ul li a{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding: .555556rem 0;
  color: #0d0d0d;
}
.housetype-list li .list-content{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
}
.housetype-list li .pic-item img{
  display: block;
  max-width: 100%;
  width: 1.722222rem;
  height: 1.509259rem;
}
.housetype-list li .describe-item{
  position: relative;
  padding-left: .333333rem;
  text-align: left;
}
.housetype-list li .describe-item h4{
  position: relative;
  font-size: .333333rem;
}
.housetype-list li .describe-item h4 span{
  display: inline-block;
  vertical-align: middle;
  max-width: 4.814815rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.housetype-list li .describe-item h4 b{
  display: inline-block;
  vertical-align: middle;
  width: .740741rem;
  height: .287037rem;
  background-image: url(../../../static/img/recomment/laud.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: .314815rem .287037rem;
}
.housetype-list li .describe-item p{
  position: absolute;
  left: .333333rem;
  bottom: 0;
}
.housetype-list li .describe-item p strong{
  color: #f6372c;
  font-weight: normal;
}
.housetype-list li .list-button{
  position: absolute;
  right: 0;
  top: .555556rem;
}
.housetype-list li .list-button button{
  display: block;
  width: 1.944444rem;
  height: .62963rem;
  margin-bottom: .231481rem;
  border-radius: .037037rem;
  border: 1px solid #ffcd00;
  color: #1d1d1d;
  font-size: .296296rem;
  background-color: #ffcd00;
}
.housetype-list li .list-button button:first-child{
  background-color: #fff;
}
</style>
