# ขึ้น study.nirva.one

เว็บเรียนเป็นไฟล์สแตติก เปิดอ่านที่ **https://study.nirva.one** โดยไม่ต้องมี Node

บิลด์เสิร์ฟที่รากโดเมน ไม่มี prefix `/nirva-academy/`

## สองอย่างที่ทำให้โดเมนขึ้น

โซน `nirva.one` อยู่ที่ Cloudflare แล้ว (NS: `thaddeus` / `katelyn`) แต่ชื่อ `study` ยังไม่มีเรคคอร์ด เลย resolve ไม่ได้

GitHub Pages เปิดแล้ว (`gh-pages` / root, custom domain = `study.nirva.one`) และ `nirvacore.github.io/nirva-academy` ตอบ 301 ไปที่โดเมนนี้แล้ว เหลือแค่ DNS

### 1. Cloudflare DNS

| Type | Name | Content | Proxy |
| --- | --- | --- | --- |
| CNAME | `study` | `nirvacore.github.io` | DNS only (เมฆเทา) |

ตรวจด้วย `dig +short study.nirva.one CNAME` ต้องได้ `nirvacore.github.io.`

หรือให้ตัวแทนยิง API (Zone DNS Edit บน `nirva.one`):

```bash
export CLOUDFLARE_API_TOKEN=...   # อย่าแปะลงแชต
./deploy/cloudflare-study-cname.sh
```

พอ GitHub ออกใบรับรองแล้ว จะเปิด Proxy (เมฆส้ม) ก็ได้ โหมด SSL ตั้ง **Full (strict)**

### 2. GitHub Pages

รีโป **Settings → Pages**

- Source = Deploy from a branch
- Branch `gh-pages` / `/ (root)`
- Custom domain = `study.nirva.one`
- Enforce HTTPS เมื่อใบรับรองออก

ไฟล์ `CNAME` ในสาขา `gh-pages` ถูกเขียนโดย workflow แล้ว เป็น `study.nirva.one`

ตรวจ:

```bash
curl -I https://study.nirva.one
curl -I https://study.nirva.one/start/
curl -I https://study.nirva.one/learn/mirror/
```

ต้องได้ `200`

## ทางเลือก: VPS Netcup

ถ้าไม่ใช้ GitHub Pages ให้ชี้โดเมนมาที่เครื่องแทน

| Type | Name | Content | Proxy |
| --- | --- | --- | --- |
| A | `study` | IPv4 ของ VPS Netcup | DNS only |
| AAAA | `study` | IPv6 ของ VPS ถ้ามี | DNS only |

บน VPS:

```bash
sudo apt update
sudo apt install -y git docker.io docker-compose-v2
sudo usermod -aG docker "$USER"

sudo mkdir -p /opt/ai-acadamy
sudo chown "$USER":"$USER" /opt/ai-acadamy
git clone https://github.com/Nirvacore/nirva-academy.git /opt/ai-acadamy
cd /opt/ai-acadamy
git checkout main

chmod +x deploy/netcup/deploy.sh
./deploy/netcup/deploy.sh
```

Caddy เสิร์ฟโฟลเดอร์ `out/` และขอใบรับรอง Let's Encrypt ให้ `study.nirva.one`

อัปเดตครั้งถัดไป:

```bash
cd /opt/ai-acadamy
git pull
./deploy/netcup/deploy.sh
```

หรือใส่ GitHub Actions secrets แล้วให้ workflow `Deploy study.nirva.one` ดึงให้:

- `NETCUP_HOST` — IP หรือ hostname ของ VPS
- `NETCUP_USER` — ผู้ใช้ SSH
- `NETCUP_SSH_KEY` — private key
