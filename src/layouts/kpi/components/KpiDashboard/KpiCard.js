const RenderDefaultKpiCard = (kpi) => (
    <div key={kpi.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
      {kpiDetailsLink ? (
        <Link to={kpiDetailsLink} onClick={() => handleKpiClick(kpi)}>
          <KpiCardContent kpi={kpi} />
        </Link>
      ) : (
        <div onClick={() => handleKpiClick(kpi)} className="cursor-pointer">
          <KpiCardContent kpi={kpi} />
        </div>
      )}
    </div>
  );

export default RenderDefaultKpiCard;