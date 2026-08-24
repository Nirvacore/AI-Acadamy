# ขึ้น study.nirva.one

เว็บเรียนเป็นไฟล์สแตติก เปิดอ่านได้โดยไม่ต้องมี Node

## ใช้ได้ก่อนโดเมนชี้มา

เปิด [https://nirvacore.github.io/AI-Acadamy/](https://nirvacore.github.io/AI-Acadamy/)

ถ้ายัง 404 ให้ตั้งครั้งเดียว: GitHub repo **Settings → Pages → Build and deployment → Source = GitHub Actions**

## โดเมน study.nirva.one

โซน `nirva.one` อยู่ที่ Cloudflare อยู่แล้ว เลือกอย่างใดอย่างหนึ่ง

### ทาง A — ชี้โดเมนมาที่ GitHub Pages

ใน Cloudflare เพิ่ม CNAME แล้วปิด Proxy (เมฆเทา) จนกว่าใบรับรองจะออก

| Type | Name | Content | Proxy |
| --- | --- | --- | --- |
| CNAME | `study` | `nirvacore.github.io` | DNS only |

จากนั้นที่ GitHub **Settings → Pages → Custom domain** ใส่ `study.nirva.one`

ถ้าใช้ custom domain ต้องบิลด์โดย**ไม่มี** `BASE_PATH=/AI-Acadamy` เพราะ GitHub จะเสิร์ฟที่รากของโดเมน ไม่ใช่ `/AI-Acadamy/` — ตั้ง `BASE_PATH` ว่างใน workflow แล้วค่อยชี้โดเมน

ระหว่างที่ยังใช้ path `/AI-Acadamy/` อยู่ ให้เรียนที่ GitHub Pages URL ด้านบน

### ทาง B — VPS Netcup

| Type | Name | Content | Proxy |
| --- | --- | --- | --- |
| A | `study` | IPv4 ของ VPS Netcup | DNS only |
| AAAA | `study` | IPv6 ของ VPS ถ้ามี | DNS only |

ตรวจด้วย:

```bash
dig +short study.nirva.one A
```

ต้องได้ IP เครื่อง Netcup ไม่ใช่ IP ของ Cloudflare (`104.21…` / `172.67…`)

พอ HTTPS ติดแล้ว จะเปิด Proxy (เมฆส้ม) ก็ได้ โหมด SSL ตั้งเป็น **Full (strict)**

บน VPS:

```bash
sudo apt update
sudo apt install -y git docker.io docker-compose-v2
sudo usermod -aG docker "$USER"
# ออกจาก SSH แล้วเข้าใหม่ครั้งหนึ่งหลังเพิ่มกลุ่ม docker

sudo mkdir -p /opt/ai-acadamy
sudo chown "$USER":"$USER" /opt/ai-acadamy
git clone https://github.com/Nirvacore/AI-Acadamy.git /opt/ai-acadamy
cd /opt/ai-acadamy
git checkout main   # หรือ branch ที่จะขึ้นจริง

chmod +x deploy/netcup/deploy.sh
./deploy/netcup/deploy.sh
```

Caddy เสิร์ฟโฟลเดอร์ `out/` และขอใบรับรอง Let's Encrypt ให้ `study.nirva.one` ถ้า DNS ชี้มาที่เครื่องนี้แล้ว

ตรวจ:

```bash
curl -I http://127.0.0.1/
curl -I https://study.nirva.one
curl -I https://study.nirva.one/learn/hallucinations/
```

ต้องได้ `200`

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
