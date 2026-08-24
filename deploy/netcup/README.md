# ขึ้น study.nirva.one บน Netcup

โดเมนเรียนคือ **https://study.nirva.one** ต้นทางรันบน VPS Netcup หลัง Nginx/Caddy DNS ของโซน `nirva.one` อยู่ที่ Cloudflare อยู่แล้ว

## สิ่งที่ต้องมี

- Netcup VPS (Ubuntu 24.04) เปิดพอร์ต 80 และ 443
- เข้า SSH ได้
- ใน Cloudflare เพิ่มเรคอร์ด `study`

## 1. DNS ที่ Cloudflare

Proxy เริ่มต้นเป็น **DNS only** (เมฆเทา) จนกว่าใบรับรองจะออก

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

## 2. บน VPS Netcup

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

Caddy จะขอใบรับรอง Let's Encrypt ให้ `study.nirva.one` เอง

## 3. ตรวจ

```bash
curl -I https://study.nirva.one
curl -I https://study.nirva.one/learn/hallucinations
```

ต้องได้ `200`

## อัปเดตครั้งถัดไป

```bash
cd /opt/ai-acadamy
git pull
./deploy/netcup/deploy.sh
```

หรือใส่ GitHub Actions secrets แล้วให้ workflow `Deploy study.nirva.one` ดึงให้:

- `NETCUP_HOST` — IP หรือ hostname ของ VPS
- `NETCUP_USER` — ผู้ใช้ SSH
- `NETCUP_SSH_KEY` — private key
