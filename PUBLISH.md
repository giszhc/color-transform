发布前检查清单

1. 检查 package.json
   - name: 是否为你要发布的包名（例如 @giszhc/color-transform）
   - version: 更新到新的版本号（遵循 semver）
   - files/main/module/types: 指向 dist/ 产物
   - publishConfig.access: public（scope 包需要）

2. 本地构建
   - `pnpm run build`（已生成 dist/）
   - 检查 `dist/` 是否包含 JS 与 types

3. 清理
   - 删除不必要的测试与 CI（已完成）
   - 确认 README、LICENSE、CHANGELOG（如有）是否准备好

4. 登录并发布
   - `pnpm login`（输入 npm 账户）
   - `pnpm publish --access public`

5. 发布后
   - 在 npm 页面检查新版本信息
   - 在 GitHub/CHANGELOG 中记录发布说明

注意：我可以代为运行 `pnpm publish --access public`，但需要你在本地输入 npm 凭据或提供授权令牌（不建议在聊天中直接分享凭据）。