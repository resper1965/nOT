// API Route for IP Address Management (IPAM) data
import { NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient();

    // 1. Get total subnets
    const { data: subnets, error: subnetsError } = await supabase
      .from('ip_subnets')
      .select('*');

    if (subnetsError) throw subnetsError;

    // 2. Get total IP addresses
    const { data: ips, error: ipsError } = await supabase
      .from('ip_addresses')
      .select('id, ip_address, subnet_id, status')
      .eq('status', 'active');

    if (ipsError) throw ipsError;

    // 3. Calculate utilization per subnet
    const subnetUtilization = subnets?.map((subnet) => {
      const ipsInSubnet = ips?.filter((ip) => ip.subnet_id === subnet.id).length || 0;
      const utilizationPercent = subnet.usable_ips > 0
        ? Math.round((ipsInSubnet / subnet.usable_ips) * 100)
        : 0;
      
      return {
        ...subnet,
        allocated_ips: ipsInSubnet,
        utilization_percent: utilizationPercent,
      };
    }) || [];

    // 4. Calculate average utilization
    const totalUsableIPs = subnetUtilization.reduce((sum, s) => sum + (s.usable_ips || 0), 0);
    const totalAllocatedIPs = subnetUtilization.reduce((sum, s) => sum + (s.allocated_ips || 0), 0);
    const averageUtilization = totalUsableIPs > 0
      ? Math.round((totalAllocatedIPs / totalUsableIPs) * 100)
      : 0;

    // 5. Detect IP conflicts (same IP used by multiple devices)
    const ipConflictMap = new Map<string, any[]>();
    ips?.forEach((ip) => {
      const ipStr = ip.ip_address as string;
      if (!ipConflictMap.has(ipStr)) {
        ipConflictMap.set(ipStr, []);
      }
      ipConflictMap.get(ipStr)!.push(ip);
    });

    const conflicts = Array.from(ipConflictMap.entries())
      .filter(([_, ipList]) => ipList.length > 1)
      .map(([ipAddress, ipList]) => ({
        ip_address: ipAddress,
        conflict_count: ipList.length,
        devices: ipList.map((ip) => ip.id),
      }));

    // 6. Get subnets without Purdue level mapping
    const subnetsWithoutPurdue = subnetUtilization.filter((subnet) => {
      // Check if subnet has purdue_level in metadata or related table
      // For now, we'll check if subnet has zone_id and zone has purdue_level
      return !subnet.zone_id || subnet.criticality === null;
    });

    // 7. Get IPs by VLAN
    const { data: ipsByVlanRaw, error: vlanError } = await supabase
      .from('ip_addresses')
      .select('vlan_id')
      .eq('status', 'active')
      .not('vlan_id', 'is', null);

    if (vlanError) throw vlanError;

    const vlanCountMap = new Map<number, number>();
    ipsByVlanRaw?.forEach((ip) => {
      const vlanId = ip.vlan_id as number;
      vlanCountMap.set(vlanId, (vlanCountMap.get(vlanId) || 0) + 1);
    });

    // Get VLAN names
    const vlanIds = Array.from(vlanCountMap.keys());
    const { data: vlans, error: vlansError } = await supabase
      .from('vlans')
      .select('vlan_id, vlan_name')
      .in('vlan_id', vlanIds);

    const byVlan = Array.from(vlanCountMap.entries())
      .map(([vlanId, count]) => {
        const vlan = vlans?.find((v) => v.vlan_id === vlanId);
        return {
          vlan_id: vlanId,
          vlan_name: vlan?.vlan_name || `VLAN ${vlanId}`,
          count: count,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 8. Get top subnets by utilization
    const topSubnets = subnetUtilization
      .sort((a, b) => (b.allocated_ips || 0) - (a.allocated_ips || 0))
      .slice(0, 10)
      .map((subnet) => ({
        subnet_cidr: subnet.subnet_cidr,
        subnet_name: subnet.subnet_name || subnet.subnet_cidr,
        network_address: subnet.network_address,
        usable_ips: subnet.usable_ips,
        allocated_ips: subnet.allocated_ips || 0,
        utilization_percent: subnet.utilization_percent || 0,
        vlan_id: subnet.vlan_id,
        criticality: subnet.criticality,
        purdue_level: subnet.zone_id ? 'unknown' : null, // Will be filled from zones table if needed
      }));

    return NextResponse.json({
      statistics: {
        total_subnets: subnets?.length || 0,
        total_ips: ips?.length || 0,
        total_usable_ips: totalUsableIPs,
        total_allocated_ips: totalAllocatedIPs,
        average_utilization_percent: averageUtilization,
        total_conflicts: conflicts.length,
        subnets_without_purdue: subnetsWithoutPurdue.length,
      },
      subnets: topSubnets,
      by_vlan: byVlan,
      conflicts: conflicts,
      subnets_without_purdue: subnetsWithoutPurdue.map((s) => ({
        subnet_cidr: s.subnet_cidr,
        subnet_name: s.subnet_name,
        usable_ips: s.usable_ips,
        allocated_ips: s.allocated_ips || 0,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching IPAM data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch IPAM data',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
