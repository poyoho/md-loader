function html(...args: any) {
  return args
}

export default html`
<div class="demo-block">
  <!-- 代码执行ui -->
  <div class="exec">
    <slot name="exec"></slot>
  </div>
  <!-- 源码区 -->
  <div class="expaned-block source">
    <div class="description">
      <slot name="description"></slot>
    </div>
    <div class="highlight">
      <slot name="highlight"></slot>
    </div>
  </div>
  <!-- 控制区 -->
  <div class="control">
    <!-- TODO add control mutation and more feature -->
    <em class="icon copy">copy</em>
    <em class="icon codepen">codepen</em>
    <em class="icon isExpand"></em>
    <span>展开</span>
  </div>
</div>
<style>
  .demo-block{
    border: 1px solid #ebebeb;
    background: #fafafa;
    margin: 20px 0;
    transition: .2s;
  }
  /* exec wrap */
  .exec {
    margin: 10px;
    padding: 20px;
    border-radius: 5px;
    background: #fff;
    border: 1px solid #ebebeb;
  }
  /* source wrap */
  .expaned-block {
    overflow: hidden;
    height: 0;
    transition: height .3s;
  }
  .expaned-block .description {
    margin: 0 10px;
    background: #fff;
    border: 1px solid #ebebeb;
    padding: 0 10px;
    border-radius: 5px;
  }
  .expaned-block .highlight {
    padding: 0 10px;
  }
  /* control wrap */
  .control {
    user-select: none;
    height: 30px;
    line-height: 30px;
    border-top: 1px solid #ebebeb;
    background: #fff;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    color: #e5e7eb;
  }
  .control .icon:hover {
    color: red
  }
  .control:hover {
    color: #409eff
  }
  .control span {
    display: inline-block;
    padding-left: 20px;
  }
</style>
`
