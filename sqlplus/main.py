# -*- coding: utf-8 -*-
import mmap
import struct
import socket


class IPV4Find:
    def __init__(self, file_name):

        self.buchang = 9
        self._handle = open(file_name, "rb")
        self.data = mmap.mmap(self._handle.fileno(), 0, access=mmap.ACCESS_READ)
        self.prefArr = []
        record_size = self.unpack_int_4byte(0)
        i = 0
        while i < 256:
            p = i * 8 + 4
            self.prefArr.append([self.unpack_int_4byte(p), self.unpack_int_4byte(p + 4)])
            i += 1
        self.endArr = []

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, exc_tb):
        self.close()

    def close(self):
        self._handle.close()

    def get(self, ip):

        ipdot = ip.split('.')
        prefix = int(ipdot[0])
        if prefix < 0 or prefix > 255 or len(ipdot) != 4:
            raise ValueError("invalid ip address")
        intIP = self.ip_to_int(ip)
        low = self.prefArr[prefix][0]
        high = self.prefArr[prefix][1]
        cur = low if low == high else self.search(low, high, intIP)
        # return self.addrArr[cur]
        return self.get_addr(cur)

    def search(self, low, high, k):
        M = 0
        while low <= high:
            mid = (low + high) // 2
            end_ip_num = self.unpack_int_4byte(2052 + (mid * self.buchang))
            if end_ip_num >= k:
                M = mid
                if mid == 0:
                    break
                high = mid - 1
            else:
                low = mid + 1
        return M

    def ip_to_int(self, ip):
        _ip = socket.inet_aton(ip)
        return struct.unpack("!L", _ip)[0]

    def unpack_int_4byte(self, offset):
        return struct.unpack('<L', self.data[offset:offset + 4])[0]

    def unpack_int_1byte(self, offset):
        return struct.unpack('B', self.data[offset:offset + 1])[0]

    def unpack_int_8byte(self, offset):
        return struct.unpack('<Q', self.data[offset:offset + 8])[0]

    def unpack_int_2byte(self, offset):
        return struct.unpack('<H', self.data[offset:offset + 2])[0]

    def get_addr(self, j):
        p = 2052 + (j * self.buchang)

        offset = self.unpack_int_4byte(4 + p)
        length = self.unpack_int_1byte(8 + p)
        return self.data[offset:offset + length].decode('utf-8')


class IpInfo():
    def __init__(self,results):
        #洲
        self.continent = results[0]
        #国家
        self.country = results[1]
        #国家英文简写
        self.countryCode = results[8]
        #省份
        self.province = results[2]
        #城市
        self.city = results[3]
        #区县
        self.district = results[4]
        #区域代码
        self.areaCode = results[6]
        #运营商
        self.isp = results[5]
        #经度
        self.longitude = results[9]
        #纬度
        self.latitude = results[10]
        #海拔
        self.elevation = results[11]
        #气象站
        self.weatherStation = results[14]
        #邮编
        self.zipCode = results[12]
        #城市代码
        self.cityCode = results[13]
        self.asn = results[15]
        self.timeZone = results[18]
if __name__ == '__main__':
    ip_search = IPV4Find(r"C:\\workspace\\net\\chafen_win\\configs\\ipdatacloud_scenes_mob.dat")
    ip_search.get("49.81.179.93")
    result = ip_search.get("49.81.179.93")
    results = result.split("|")
    ipinfo = IpInfo(results)
    for field_name, field_value in ipinfo.__dict__.items():
        print(f"{field_name}: {field_value}")
