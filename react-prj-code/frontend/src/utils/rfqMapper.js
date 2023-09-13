import axios from "../axios-interceptor";

export const getMappedObject = (project) => {         
    const profile = 0;
    return profile;
};

export const getCostingOptions = (project) =>
{
    var options = [];

    for (var country of project.FieldingCountries)
    {        
        for (var subMethodology of project.SubMethodology)
        {            
            var costingOption = {};
            costingOption["FieldingCountries"] = [country];
            costingOption["Methodology"] = project.Methodology;
            costingOption["SubMethodology"] = [subMethodology];
            costingOption["ResearchType"] = project.ResearchType;
            costingOption["FieldType"] = project.FieldType;
            costingOption["Mode"] = project.Mode;
            costingOption["IsMultiCountry"] = project.IsMultiCountry;
            costingOption["StudyType"] = project.StudyType;
            costingOption["VerticalId"] = project.VerticalId;
            costingOption["ProjectId"] = project.id;

            costingOption["ProfileName"] = "Default Option";
            costingOption["ProfileStatus"] = "1";
            costingOption["IsTracker"] = project.IsTracker;
            costingOption["NumberOfWaves"] = project.NumberOfWaves;
            costingOption["TrackingFrequency"] = project.TrackingFrequency;
            options.push(costingOption);            
        }
    }
    return options;
}